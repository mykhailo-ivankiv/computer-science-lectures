import Parser from './Parser.js'

export const lazy = (parserThunk) =>
  new Parser((parserState) => {
    const parser = parserThunk()
    return parser.stateTransformFunction(parserState)
  })
