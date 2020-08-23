// @ts-check
import {
  str,
  regexp,
  eof,
  many,
  sequenceOf,
  choice,
  oneOrMany,
  separatedBy,
  wrapBy,
} from './parser-combinators/index.js'

const _ = str
const __ = regexp(/[\n\s]*/).map(() => null)

const wrapBySpace = wrapBy(__)
const separatedByComma = separatedBy(wrapBySpace(_`,`))
const wrapByCurlyBrackets = wrapBy(wrapBySpace(_`{`), wrapBySpace(_`}`))

const word = regexp(/\w+/)

const tagSelector = wrapBySpace(word)
const classSelector = sequenceOf(_`.`, word).map((result) => result.join(''))
const idSelector = sequenceOf(_`#`, word).map((result) => result.join(''))
const selector = choice(tagSelector, classSelector, idSelector)
const selectors = choice(separatedByComma(selector), selector)

const propName = wrapBySpace(word)
const propValue = wrapBySpace(word)

const rule = sequenceOf(propName, _`:`, propValue, _`;`, __).map((result) => [result[0], result[2]])
const rusesList = choice(many(rule), __)
const rules = wrapByCurlyBrackets(rusesList)

const expression = sequenceOf(selectors, wrapBySpace(rules)).map(([selectors, rules]) => ({
  expression: { selectors, rules },
}))

const css = sequenceOf(choice(oneOrMany(expression), __), eof).map((result) => result[0])

const parseCss = (cssString) => css.run(cssString)

export default parseCss

const test = () => {
  // is css
  parseCss(``) /*?*/
  parseCss(`\n   \n`) /*?*/
  parseCss(`div{}`) /*?*/
  parseCss(`div {}`) /*?*/
  parseCss(`div\n{\n}\n`) /*?*/
  parseCss(`div { color:red; }`) /*?*/
  parseCss(`div { }\ndiv { }\nspan{}`) /*?*/
  parseCss(`div { color:red;\n border:none; }`) /*?*/
  parseCss(`div { color:red;\n border:none; } span {background: red;}`) /*?*/
  parseCss(`div, span { color:red;\n border:none; } span {background: red;}`) /*?*/

  //isn't css
  parseCss(`{}`) /*?*/
}

test()
