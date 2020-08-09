import { reduce, find } from './utils.ts'

type ParserState = {
  src: string
  index: number
  isError: boolean
}
type Parser = (state: ParserState) => ParserState

// Basic parsers
export const str = (str: string): Parser => (state) => {
  if (state.isError) return state

  const { index, src } = state
  src.startsWith(str, index) /*?*/
  return src.startsWith(str, index)
    ? { ...state, index: index + str.length } //
    : { ...state, isError: true } //
}

export const regexp = (regexp: RegExp): Parser => {
  regexp = new RegExp(`^(${regexp.source})`, 'g')

  return (state) => {
    if (state.isError) return state

    const { index, src } = state
    const trimmedStr = src.slice(index)
    const regexMatch = trimmedStr.match(regexp)

    return regexMatch ? { ...state, index: index + regexMatch[0].length } : { ...state, isError: true }
  }
}

// Combinations
export const sequenceOf = (...parsers: Parser[]): Parser => (state) =>
  reduce<Parser, ParserState>((acc, fn) => fn(acc), state, parsers)

export const choice = (...parsers: Parser[]): Parser => (state) => {
  const parser = find((parser) => parser(state).isError === false, parsers)

  return parser === undefined ? { ...state, isError: true } : parser(state)
}

export const many = (parser: Parser): Parser =>
  function repeater(state): ParserState {
    let nextState = parser(state)
    return nextState.isError ? state : repeater(nextState)
  }

export const oneOrMany = (parser: Parser) => sequenceOf(parser, many(parser))

export const run = (parser: Parser) => (src: string): Parser => parser({ src, isError: false, index: 0 })
