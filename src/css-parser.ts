import { str, regexp, sequenceOf, choice, many, run, oneOrMany } from './parser-combinator.ts'

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

const isValidCSS = (cssString: string) => {
  const result = run(choice(oneOrMany(cssExpression), __))(cssString)

  return result.index === cssString.length && !result[1]
}

isValidCSS(`\n   \n`) /*?*/

const test = () => {
  // is css
  isValidCSS(``) /*?*/
  isValidCSS(`\n   \n`) /*?*/
  isValidCSS(`div{}`) /*?*/
  isValidCSS(`div {}`) /*?*/
  isValidCSS(`div\n{\n}\n`) /*?*/
  isValidCSS(`div { color:red; }`) /*?*/
  isValidCSS(`div { }\ndiv { }\nspan{}`) /*?*/
  isValidCSS(`div { color:red;\n border:none; }`) /*?*/
  isValidCSS(`div { color:red;\n border:none; } span {background: red;}`) /*?*/
  isValidCSS(`div, span { color:red;\n border:none; } span {background: red;}`) /*?*/

  //isn't css
  isValidCSS(`{}`) /*?*/
}

test()
