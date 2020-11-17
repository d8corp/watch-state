import State from '../../classes/State'
import Cache from '../../classes/Cache'
import Mixed from '../../classes/Mixed'

const VALUES = Symbol('state values')

interface StateOrComputedValues {
  [key: string]: State | Cache | Mixed
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
