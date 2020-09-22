import { concat, init, isEmpty, last, reduce } from './utils.js'

export const mergeTwoIntervals = (A, B) => {
  const AStart = A.start
  const AEnd = A.end

  const BStart = B.start
  const BEnd = B.end

  if (AEnd < BStart) return [A, B] // [--A--] ___ [--B--]
  if (BEnd < AStart) return [B, A] // [--B--] ___ [--A--]

  if (AStart <= BStart && AEnd >= BEnd) return [A] // [ A- [--B--] -A]
  if (BStart <= AStart && BEnd >= AEnd) return [B] // [ B- [--A--] -B]

  if (AStart <= BStart && AEnd <= BEnd) return [{ start: AStart, end: BEnd }] // [A-- [B --A] --B]
  if (BStart <= AStart && BEnd <= AEnd) return [{ start: BStart, end: AEnd }] // [B-- [A --B] --A]

  return [A, B]
}

// prettier-ignore
export const subtractInterval = (A, B) => {
  const A_ = A.start
  const _A = A.end

  const B_ = B.start
  const _B = B.end

  if (_A < B_) return [A] // [--A--] ___ [--B--]
  if (_B < A_) return [A] // [--B--] ___ [--A--]

  if (A_ <= B_ && _A >= _B) return [{ start: A_, end: B_ }, {start: _B, end: _A}] // [ A- [--B--] -A]

  if (B_ <= A_ && _B >= _A) return [A] // [ B- [--A--] -B]

  if (A_ <= B_ && _A <= _B) return [{ start: A_, end: B_ }, { start: B_, end: _A }] // [A-- [B --A] --B]
  if (B_ <= A_ && _B <= _A) return [{ start: A_, end: _B }, { start: _B, end: _A }] // [B-- [A --B] --A]
}

export const mergeIntervals = (intervalsArray) =>
  reduce(
    (result, interval) =>
      isEmpty(result) ? [interval] : concat(init(result), mergeTwoIntervals(last(result), interval)),
    [],
    intervalsArray,
  )
