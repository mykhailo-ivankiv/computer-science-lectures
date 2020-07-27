export const str = (str) => (state) => {
  if (state.isError) return state

  const { index, src } = state

  return src.startsWith(str, index)
    ? { ...state, index: index + str.length } //
    : { ...state, isError: true } //
}

export const regexp = (regexp) => {
  regexp = new RegExp(`^(${regexp.source})`, 'g')

  return (state) => {
    if (state.isError) return state

    const { index, src } = state
    const trimmedStr = src.slice(index)
    const regexMatch = trimmedStr.match(regexp)

    return regexMatch ? { ...state, index: index + regexMatch[0].length } : { ...state, isError: true }
  }
}

export const sequenceOf = (...parsers) => (state) => parsers.reduce((acc, fn) => fn(acc), state)

export const choice = (...fns) => (state) => {
  if (state.isError) return state

  let result
  for (const fn of fns) {
    result = fn(state)
    if (result.isError === false) return result
  }

  return result
}

export const many = (parser) => (state) => {
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
