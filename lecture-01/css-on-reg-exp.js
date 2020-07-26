import { str, regexp, sequenceOf, choice, many, run } from './parser-combinator.js'

const selector = regexp(/\w+/)
const spaceOrNewLine = regexp(/[\n\s]*/)
const openBracket = str('{')
const closeBracket = str('}')
const rule = sequenceOf(
  regexp(/\w+/),
  regexp(/\s*/),
  str(':'),
  regexp(/\s*/),
  regexp(/\w+/),
  regexp(/\s*/),
  str(';'),
  spaceOrNewLine,
)

const cssExpression = sequenceOf(
  selector,
  spaceOrNewLine,
  openBracket,
  spaceOrNewLine,
  choice(many(rule), spaceOrNewLine),
  spaceOrNewLine,
  closeBracket,
  spaceOrNewLine,
)

const isValidCSS = (cssString) => {
  const result = run(choice(many(cssExpression), spaceOrNewLine))(cssString)

  return result.index === cssString.length && !result[1]
}

// isValidCSS(`div { color:red;\n border:none; }`) /*?*/;
isValidCSS(`\n   \n`) /*?*/

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

  //isn't css
  isValidCSS(`{}`) /*?*/
}

test()
