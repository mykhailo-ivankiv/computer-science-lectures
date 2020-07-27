import { str, regexp, sequenceOf, choice, many, run } from './parser-combinator.js'

const __ = regexp(/[\n\s]*/)
const selector = sequenceOf(__, regexp(/\w+/))
const rule = sequenceOf(
  regexp(/\w+/),
  regexp(/\s*/),
  str(':'),
  regexp(/\s*/),
  regexp(/\w+/),
  regexp(/\s*/),
  str(';'),
  __,
)
const rules = sequenceOf(__, str('{'), __, choice(many(rule), __), str('}'))

const selectors = choice(sequenceOf(many(sequenceOf(selector, str(','))), selector), selector)

const cssExpression = sequenceOf(selectors, __, rules, __)

const isValidCSS = (cssString) => {
  const result = run(choice(many(cssExpression), __))(cssString)

  return result.index === cssString.length && !result[1]
}

isValidCSS(`div, span {}`) /*?*/
isValidCSS(`div, span, article {}`) /*?*/

const test = () => {
  // is css
  isValidCSS(``) /*?*/
  isValidCSS(`\n   \n`) /*?*/
  isValidCSS(`div{}`) /*?*/
  isValidCSS(`div {}`) /*?*/
  isValidCSS(`div\n{\n}\n`) /*?*/
  isValidCSS(`div { }\ndiv { }\nspan{}`) /*?*/
  isValidCSS(`div { color:red; }`) /*?*/
  isValidCSS(`div { color:red;\n border:none; }`) /*?*/
  isValidCSS(`div { color:red;\n border:none; } span {background: red;}`) /*?*/
  isValidCSS(`div, span { color:red;\n border:none; } span {background: red;}`) /*?*/

  //isn't css
  isValidCSS(`{}`) /*?*/
}

test()
