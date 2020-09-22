// @ts-check
export const init = (src) => ({ src, index: 0, result: null, isError: false, error: null })
export const update = (index, result, state) => ({ ...state, index, result })
export const updateResult = (result, state) => ({ ...state, result })
export const setError = (error, state) => ({ ...state, isError: true, error })

export default class Parser {
  constructor(stateTransformFunction) {
    this.stateTransformFunction = stateTransformFunction
  }

  run = (src) => this.stateTransformFunction(init(src))
  map = (fn) =>
    new Parser((state) => {
      const nextState = this.stateTransformFunction(state)

      return nextState.isError ? nextState : updateResult(fn(nextState.result, state.index), nextState)
    })

  chain = (fn) =>
    new Parser((state) => {
      const nextState = this.stateTransformFunction(state)

      if (nextState.isError) return nextState

      const nextParser = fn(nextState.result, state.index)

      return nextParser.stateTransformFunction(nextState)
    })

  mapError = (fn) =>
    new Parser((state) => {
      const nextState = this.stateTransformFunction(state)

      return nextState.isError ? setError(fn(nextState.error, state.index), nextState) : nextState
    })
}
