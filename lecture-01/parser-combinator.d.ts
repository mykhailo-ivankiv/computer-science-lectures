type parserState = {
  src: string
  index: number
  isError: boolean
}

export const str: (str: string) => (state: parserState) => parserState
export const regexp: (regexp: RegExp) => (state: parserState) => parserState
export const sequenceOf: (...fns: Function[]) => (arg: any) => any
export const run: (...fns: Function[]) => (src: string) => parserState
export const choice: (...fns: Function[]) => (state: parserState) => parserState
export const many: (...fns: Function[]) => (state: parserState) => parserState
