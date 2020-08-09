type ParserState = {
  src: string
  index: number
  isError: boolean
}
type Parser = (state: ParserState) => ParserState

export const str = (str: string): Parser => (state) => {
  if (state.isError) return state

  const { index, src } = state

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
export const sequenceOf = (...parsers: Parser[]): Parser => (state) => parsers.reduce((acc, fn) => fn(acc), state)

export const choice = (...fns: Parser[]): Parser => (state) => {
  if (state.isError) return state
  if (fns.length === 0) return state

  let result
  for (const fn of fns) {
    result = fn(state)
    if (result.isError === false) return result
  }

  return result
}

export const many = (parser: Parser): Parser => (state) => {
  if (state.isError) return state

  let result = parser(state)
  let prevResult = parser(state)

  while (!result.isError) {
    result = parser(result)
    if (result.isError) return prevResult
    prevResult = result
  }

  return prevResult
}

export const run = (...parsers) => (src) => sequenceOf(...parsers)({ src, isError: false, index: 0 })
