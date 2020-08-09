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

const parseCss = (cssString: string) => run(choice(oneOrMany(cssExpression), __))(cssString)

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
