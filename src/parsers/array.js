import { wrapBy, str, separatedBy, choice, lazy } from '../parser-combinators/index.js'
import { number } from './number.js'

const wrapByBrackets = wrapBy(str('['), str(']'))
const separatedByComma = separatedBy(str(','))

const array = lazy(() => wrapByBrackets(value))
const value = separatedByComma(
  choice(
    number, //
    array,
  ),
)

array.run(`[11,[23,3,3],1]`) /*?*/
