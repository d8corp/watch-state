const VALUES = Symbol('state values')
import {Computed, State} from '.'

interface StateValues {
  [key: string]: State | Computed
}

function stateValues (target: object): StateValues {
  if (!(VALUES in target)) {
    target[VALUES] = {}
  }
  return target[VALUES]
}

export default stateValues

export {
  StateValues
}
