import { str, sequenceOf, separatedBy, regexp, choice, many, eof, oneOrMany } from './parser-combinators'
import { number } from './number.js'
import { reduce } from './utils.js'

const word = regexp(/\w+/)
const newLine = str('\n').map(() => null)

const sumExpr = (values) =>
  separatedBy(str('+'))(values) //
    .map((result) => reduce((a, b) => a + b, 0, result))

let identifier = sequenceOf(word, str('='), number).map((result) => ({ name: result[0], value: result[2] }))


const first = (a) => a[0]

let result_ = null
const language = (initParser) => choice(
  sequenceOf(sumExpr(initParser), newLine).map(first), //
  sequenceOf(identifier, newLine).map(first), //
  eof,
).chain( (result) => {
  if (result === null) return  str("").map(() => result_);

  result_ = result
  if (result.name) return language(choice(initParser, str(result.name).map(()=>result.value)))
  return language(initParser)
})


language(number).run(
`a=3
b=4
c=5
a+b+c
`) /*?*/
