import { find, reduceWhile } from './utils.js'

const init = (src) => ({ src, index: 0, result: null, isError: false, error: null })
const update = (index, result, state) => ({ ...state, index, result })
const updateResult = (result, state) => ({ ...state, result })
const setError = (error, state) => ({ ...state, isError: true, error })

// Combinations
export const sequenceOf = (...parsers) =>
  new Parser((state) => {
    const result = []
    const nextState = reduceWhile(
      (state) => !state.isError,
      (state, parser) => {
        const nextState = parser.stateTransformFunction(state)
        result.push(nextState.result)
        return nextState
      },
      state,
      parsers,
    )

    return updateResult(result, nextState)
  })

export const choice = (...parsers) =>
  new Parser((state) => {
    const parser = find < Parser > ((parser) => parser.stateTransformFunction(state).isError === false, parsers)

    return parser === undefined
      ? setError(`Unable to match any parser on index ${state.index}`, state)
      : parser.stateTransformFunction(state)
  })

export const many = (parser) => {
  const repeater = (state, result) => {
    let nextState = parser.stateTransformFunction(state)

    return nextState.isError ? [state, result] : repeater(nextState, [...result, nextState.result])
  }

  return new Parser((state) => {
    const [nextState, result] = repeater(state, [])
    return updateResult(result, nextState)
  })
}

export const oneOrMany = (parser) => sequenceOf(parser, many(parser))

class Parser {
  constructor(stateTransformFunction) {
    this.stateTransformFunction = stateTransformFunction
  }

  run = (src) => this.stateTransformFunction(init(src))
  map = (fn) =>
    new Parser((state) => {
      const nextState = this.stateTransformFunction(state)

      return nextState.isError ? nextState : updateResult(fn(nextState.result), nextState)
    })

  mapError = (fn) =>
    new Parser((state) => {
      const nextState = this.stateTransformFunction(state)

      return nextState.isError ? setError(fn(nextState.error, state), nextState) : nextState
    })
}

// Basic parsers
export const str = (str) =>
  new Parser((state) => {
    if (state.isError) return state

    const { index, src } = state
    src.startsWith(str, index) /*?*/
    return src.startsWith(str, index)
      ? update(index + str.length, str, state)
      : setError(`Trying to match "${str}" here, but got: "${src.slice(index)}"`, state)
  })

export const eof = new Parser((state) => {
  if (state.isError) return state

  return state.index === state.src.length
    ? state
    : setError(`Expect end of file, but got ${state.src.slice(state.index)}`, state)
})

export const regexp = (regexp) => {
  const regexpToMatch = new RegExp(`^(${regexp.source})`, 'g')

  return new Parser((state) => {
    if (state.isError) return state

    const { index, src } = state
    const trimmedStr = src.slice(index)
    const regexMatch = trimmedStr.match(regexpToMatch)

    return regexMatch
      ? update(index + regexMatch[0].length, regexMatch[0], state)
      : setError(`Regexp ${regexp.toString()} does not match string: "${src.slice(index)}"`, state)
  })
}
