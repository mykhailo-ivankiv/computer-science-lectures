type ParserState = {
  src: string
  index: number
  isError: boolean
}

type Parser = (state: ParserState) => ParserState

export const str: (str: string) => Parser
export const regexp: (regexp: RegExp) => Parser

export const sequenceOf: (...fns: Parser[]) => (arg: any) => any
export const choice: (...fns: Parser[]) => Parser
export const many: (...fns: Parser[]) => Parser

export const run: (...fns: Parser[]) => (src: string) => ParserState
