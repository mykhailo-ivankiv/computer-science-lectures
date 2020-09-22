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
} from '../parser-combinators/index.js'

const _ = str
const __ = regexp(/[\n\s]*/).map(() => null)
const _I_ = str('').map((_, index) => index)

const wrapBySpace = wrapBy(__)
const separatedByComma = separatedBy(wrapBySpace(_`,`))
const wrapByCurlyBrackets = wrapBy(wrapBySpace(_`{`), wrapBySpace(_`}`))

const word = regexp(/\w+/)

const tagSelector = wrapBySpace(word)
const classSelector = sequenceOf(_`.`, word).map((result) => result.join(''))
const idSelector = sequenceOf(_`#`, word).map((result) => result.join(''))
const selector = choice(tagSelector, classSelector, idSelector)
const selectors = choice(separatedByComma(selector))
// prettier-ignore
const propName = wrapBySpace(word)
// prettier-ignore
const propValue = wrapBySpace(word)

const declaration = sequenceOf(_I_, propName, _`:`, propValue, _`;`, __, _I_).map((result) => ({
  type: 'decl',
  prop: result[1].value,
  value: result[3].value,
  source: { start: result[0], end: result[6] },
}))
const declarationList = choice(many(declaration), __)
const declarations = wrapByCurlyBrackets(declarationList)

const rule = sequenceOf(_I_, selectors, wrapBySpace(declarations), _I_).map(
  ([start, selectors, declarations, end]) => ({
    type: 'rule',
    nodes: declarations,
    selector: selectors.join(', '),
    source: { start, end },
  }),
)

const css = sequenceOf(_I_, choice(oneOrMany(rule), __), _I_, eof).map((result) => ({
  type: 'root',
  nodes: result[1],
  source: { start: result[0], end: result[2] },
}))

const parseCss = (cssString) => {
  const parseState = css.run(cssString)
  return parseState.isError ? parseState.error : parseState.result
}

export default parseCss
