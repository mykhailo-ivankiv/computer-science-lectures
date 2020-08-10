import { find, reduceWhile } from './utils.ts'

type ParserState = { src: string; index: number; result: any; isError: boolean; error: any }
type StateTransform = (state: ParserState) => ParserState

const init = (src: string): ParserState => ({ src, index: 0, result: null, isError: false, error: null })
const update = (index: number, result: any, state: ParserState): ParserState => ({ ...state, index, result })
const updateResult = (result: any, state: ParserState): ParserState => ({ ...state, result })
const setError = (error: any, state: ParserState): ParserState => ({ ...state, isError: true, error })

// Combinations
export const sequenceOf = (...parsers: Parser[]): Parser =>
  new Parser((state) => {
    const result: any[] = []
    const nextState = reduceWhile<Parser, ParserState>(
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

export const choice = (...parsers: Parser[]): Parser =>
  new Parser((state) => {
    const parser = find<Parser>((parser) => parser.stateTransformFunction(state).isError === false, parsers)

    return parser === undefined
      ? setError(`Unable to match any parser on index ${state.index}`, state)
      : parser.stateTransformFunction(state)
  })

export const many = (parser: Parser): Parser => {
  const repeater = (state: ParserState, result: any[]): [ParserState, any[]] => {
    let nextState = parser.stateTransformFunction(state)

    return nextState.isError ? [state, result] : repeater(nextState, [...result, nextState.result])
  }

  return new Parser((state) => {
    const [nextState, result] = repeater(state, [])
    return updateResult(result, nextState)
  })
}

export const oneOrMany = (parser: Parser): Parser => sequenceOf(parser, many(parser))

class Parser {
  public stateTransformFunction: StateTransform

  constructor(stateTransformFunction: StateTransform) {
    this.stateTransformFunction = stateTransformFunction
  }

  run = (src: string): ParserState => this.stateTransformFunction(init(src))
  map = (fn: Function) =>
    new Parser((state) => {
      const nextState = this.stateTransformFunction(state)

      return nextState.isError ? nextState : updateResult(fn(nextState.result), nextState)
    })

  mapError = (fn: Function) =>
    new Parser((state) => {
      const nextState = this.stateTransformFunction(state)

      return nextState.isError ? setError(fn(nextState.error, state), nextState) : nextState
    })
}

// Basic parsers
export const str = (str: string): Parser =>
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

export const regexp = (regexp: RegExp): Parser => {
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
