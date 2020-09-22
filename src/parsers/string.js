import { regexp, choice, wrapBy, str } from '../parser-combinators/index.js'

const stringBody = regexp(/[\w\s-.,]+/)
export const string = choice(
  wrapBy(str(`"`))(stringBody), //
  wrapBy(str(`'`))(stringBody), //
  wrapBy(str('`'))(stringBody), //
)
