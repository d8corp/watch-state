const VALUES = Symbol('state values')
import Computed, {State} from './Computed'

interface StateOrComputedValues {
  [key: string]: State | Computed
}

function stateValues (target: object): StateOrComputedValues {
  if (!(VALUES in target)) {
    target[VALUES] = {}
  }
  return target[VALUES]
}

export default stateValues

export {
  stateValues,
  StateOrComputedValues,
}
