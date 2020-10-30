const VALUES = Symbol('state values')
import {State} from '.'
import Computed from './Computed'

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
