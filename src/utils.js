/**
 * Return `true` if array is empty
 * @param {any[]} arr
 * @returns {boolean}
 */
export function isEmpty(arr) {
  return arr.length === 0
}

export const head = (arr) => arr[0]
export const tail = ([_, ...tail]) => tail
export const identity = (a) => a
export const not = (predicete) => (...args) => !predicete(...args)

export const reduce = (fn, acc, arr) => (isEmpty(arr) ? acc : reduce(fn, fn(acc, head(arr)), tail(arr)))

export const reduceWhile = (predicate, fn, acc, arr) =>
  isEmpty(arr) ? acc : !predicate(acc, head(arr)) ? acc : reduceWhile(predicate, fn, fn(acc, head(arr)), tail(arr))

export const find = (predicate, arr) => {
  const result = reduceWhile(not(predicate), (acc, el) => el, head(arr), tail(arr))

  return predicate(result) ? result : undefined
}
