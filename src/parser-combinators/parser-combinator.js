// @ts-check
import { find, mapAccum, unfold, last } from '../utils.js'
import Parser, { setError, updateResult } from './Parser.js'

// Combinations
export const sequenceOf = (...parsers) =>
  new Parser((state) => {
    const [nextState, result] = mapAccum(
      (state, parser) => {
        const nextState = parser.stateTransformFunction(state)
        return [nextState, nextState.result]
      },
      state,
      parsers,
    )

    return updateResult(result, nextState)
  })

export const choice = (...parsers) =>
  new Parser((state) => {
    const parser = find((parser) => parser.stateTransformFunction(state).isError === false, parsers)

    return parser === undefined
      ? setError(`Unable to match any parser on index ${state.index}`, state)
      : parser.stateTransformFunction(state)
  })

export const many = (parser) =>
  new Parser((state) => {
    const states = unfold((state) => {
      const nextState = parser.stateTransformFunction(state)
      return nextState.isError ? false : [nextState, nextState]
    }, state)

    const nextState = last(states) || state
    const result = states.map(({ result }) => result)
    return updateResult(result, nextState)
  })

export const oneOrMany = (parser) => sequenceOf(parser, many(parser)).map((result) => result.flat())

export const wrapBy = (...wrappers) => (parser) => {
  const [startWrapperParser, endWrapperParser = wrappers[0]] = wrappers
  return sequenceOf(startWrapperParser, parser, endWrapperParser).map((result) => result[1])
}

export const separatedBy = (separator) => (parser) =>
  sequenceOf(many(sequenceOf(parser, separator).map((result) => result[0])), parser).map((result) => result.flat())
