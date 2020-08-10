import { str, regexp, sequenceOf, choice, many, oneOrMany, eof } from './parser-combinator.ts'

const _ = (s) => str(s)
const __ = regexp(/[\n\s]*/)

const space = regexp(/\s*/)
const word = regexp(/\w+/)
const _word_ = sequenceOf(space, word, space).map((res) => res[1])

const selector = _word_
const propName = _word_
const propValue = _word_

const rule = sequenceOf(propName, _`:`, propValue, _`;`, __).map(([key, _s, value]) => ({ key, value }))

const rules = sequenceOf(__, _`{`, __, choice(many(rule), __), _`}`)
const selectors = choice(sequenceOf(many(sequenceOf(selector, _`,`)), selector), selector)
const cssExpression = sequenceOf(selectors, __, rules, __).map(([selectors, _a, rules]) => ({ selectors, rules }))

const parseCss = (cssString: string) => sequenceOf(choice(oneOrMany(cssExpression), __), eof).run(cssString)

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
