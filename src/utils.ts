export const isEmpty = (arr) => arr.length === 0
export const head = (arr) => arr[0]
export const tail = ([_, ...tail]) => tail
export const identity = (a) => a
export const not = (predicete) => (...args) => !predicete(...args)

type ReduceFn<El, Acc> = (acc: Acc, el: El) => Acc
type Reduce = <El = any, Acc = any>(fn: ReduceFn<El, Acc>, acc: Acc, arr: El[]) => Acc
// prettier-ignore
export const reduce:Reduce = (fn , acc, arr) =>
  isEmpty(arr) ? acc
    : reduce(fn, fn(acc, head(arr)), tail(arr))

// prettier-ignore
type ReduceWhile = <El = any, Acc = any>(predicate: (acc:Acc, el: El) => boolean ,fn: ReduceFn<El, Acc>, acc: Acc, arr: El[]) => Acc

export const reduceWhile: ReduceWhile = (predicate, fn, acc, arr) =>
  isEmpty(arr) ? acc : !predicate(acc, head(arr)) ? acc : reduceWhile(predicate, fn, fn(acc, head(arr)), tail(arr))

type Find = <El = any>(fn: (el: El) => boolean, arr: any[]) => El | undefined
export const find: Find = (predicate, arr) => {
  const result = reduceWhile(not(predicate), (acc, el) => el, head(arr), tail(arr))

  return predicate(result) ? result : undefined
}
