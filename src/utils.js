// @ts-check
/**
 * Return `true` if array is empty
 * @param {any[]} arr
 * @returns {boolean}
 */
export const isEmpty = (arr) => arr.length === 0

/**
 * Return first element of array
 * @template T
 * @param {T[]} arr
 * @returns {T}
 */
export const head = (arr) => arr[0]

/**
 * @template T
 * @param {T} _
 * @param {T[]}tail
 * @returns {T[]}
 */
export const tail = ([_, ...tail]) => tail

/**
 * @template A
 * @param {A[]} arr
 * @return {A}
 */
export const last = (arr) => arr[arr.length - 1]

/**
 * @template T
 * @param {T} a
 * @returns {T}
 */
export const identity = (a) => a

export const not = (predicate) => (...args) => !predicate(...args)

/**
 * @template El, Acc
 * @param {function (Acc, El): Acc} fn
 * @param {Acc} acc
 * @param {El[]} arr
 * @returns {Acc}
 */
export const reduce = (fn, acc, arr) => (isEmpty(arr) ? acc : reduce(fn, fn(acc, head(arr)), tail(arr)))

/**
 * @template El, Acc
 * @param {function (Acc, El): boolean} predicate
 * @param {function (Acc, El): Acc} fn
 * @param {Acc} acc
 * @param {El[]} arr
 * @returns {Acc}
 */
export const reduceWhile = (predicate, fn, acc, arr) =>
  isEmpty(arr) ? acc : !predicate(acc, head(arr)) ? acc : reduceWhile(predicate, fn, fn(acc, head(arr)), tail(arr))

/**
 * @template El
 * @param { function(El): boolean} predicate
 * @param {El[]}arr
 * @returns {El|undefined}
 */
export const find = (predicate, arr) => {
  const result = reduceWhile(not(predicate), (acc, el) => el, head(arr), tail(arr))

  return predicate(result) ? result : undefined
}

/**
 * @template A, B, Acc
 * @param {function(Acc, A): [Acc, B]} fn
 * @param {Acc} acc
 * @param {A[]} arr
 * @return {[Acc, B[]]}
 */
export const mapAccum = (fn, acc, arr) =>
  reduce(
    ([accResult, mapResult], el) => {
      const [nextAcc, mappedEl] = fn(accResult, el)

      return [nextAcc, [...mapResult, mappedEl]]
    },
    [acc, []],
    arr,
  )

/**
 * @template A, B
 * @param {function (A): [B,A] } fn
 * @param {A} el
 * @return {B[]}
 */
export const unfold = (fn, el) => {
  const repeater = (el, result) => {
    const next = fn(el)
    return next === false ? result : repeater(next[1], [...result, next[0]])
  }

  return repeater(el, [])
}
