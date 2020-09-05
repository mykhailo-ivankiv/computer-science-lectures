import { choice, str, sequenceOf, many } from './parser-combinators'

const notZeroDigits = choice(
  str('1').map(() => 1),
  str('2').map(() => 2),
  str('3').map(() => 3),
  str('4').map(() => 4),
  str('5').map(() => 5),
  str('6').map(() => 6),
  str('7').map(() => 7),
  str('8').map(() => 8),
  str('9').map(() => 9),
)

const zero = str('0').map(() => 0)
const digit = choice(zero, notZeroDigits)
export const number = choice(
  zero,
  sequenceOf(notZeroDigits, many(digit)).map(
    (result) =>
      result
        .flat()
        .reverse()
        .reduce(([result, multiplier], digit) => [result + digit * multiplier, multiplier * 10], [0, 1])[0],
  ),
)
