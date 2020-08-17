// @ts-check
import Parser, { update, setError } from './Parser.js'

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
