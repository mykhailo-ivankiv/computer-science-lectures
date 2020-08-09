import { reduce, find, reduceWhile } from './utils.ts'

type ParserState = { src: string; index: number; result: any; isError: boolean; error: any }
type Parser = (state: ParserState) => ParserState

const init = (src: string): ParserState => ({ src, index: 0, result: null, isError: false, error: null })
const update = (index: number, result: any, state: ParserState): ParserState => ({ ...state, index, result })
const updateResult = (result, state) => ({ ...state, result })
const setError = (error: any, state: ParserState): ParserState => ({ ...state, isError: true, error })

// Combinations
export const sequenceOf = (...parsers: Parser[]): Parser => (state) => {
  const result: any[] = []
  const nextState = reduceWhile<Parser, ParserState>(
    (state) => !state.isError,
    (acc, fn) => {
      const nextState = fn(acc)
      result.push(nextState.result)
      return nextState
    },
    state,
    parsers,
  )

  return updateResult(result, nextState)
}

export const choice = (...parsers: Parser[]): Parser => (state) => {
  const parser = find<Parser>((parser) => parser(state).isError === false, parsers)

  return parser === undefined ? { ...state, isError: true } : parser(state)
}

export const many = (parser: Parser): Parser => {
  const repeater = (state: ParserState, result: any[]): [ParserState, any[]] => {
    let nextState = parser(state)

    return nextState.isError ? [state, result] : repeater(nextState, [...result, nextState.result])
  }

  return (state) => {
    const [nextState, result] = repeater(state, [])
    return updateResult(result, nextState)
  }
}

export const oneOrMany = (parser: Parser) => sequenceOf(parser, many(parser))

export const run = (parser: Parser) => (src: string): ParserState => parser(init(src))

// Basic parsers
export const str = (str: string): Parser => (state) => {
  if (state.isError) return state

  const { index, src } = state
  src.startsWith(str, index) /*?*/
  return src.startsWith(str, index)
    ? update(index + str.length, str, state)
    : setError(`Trying to match "${str}" here, but got: "${src.slice(index)}"`, state)
}

export const eof = (state) => {
  if (state.isError) return state

  return state.index === state.src.length
    ? state
    : setError(`Expect end of file, but got ${state.src.slice(state.index)}`, state)
}

export const regexp = (regexp: RegExp): Parser => {
  const regexpToMatch = new RegExp(`^(${regexp.source})`, 'g')

  return (state) => {
    if (state.isError) return state

    const { index, src } = state
    const trimmedStr = src.slice(index)
    const regexMatch = trimmedStr.match(regexpToMatch)

    return regexMatch
      ? update(index + regexMatch[0].length, regexMatch[0], state)
      : setError(`Regexp ${regexp.toString()} does not match string: "${src.slice(index)}"`, state)
  }
}
