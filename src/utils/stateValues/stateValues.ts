import State from '../../classes/State'
import Cache from '../../classes/Cache'
import Mixer from '../../classes/Mixer'
import getDecors from '../getDecors'

type Key = symbol | string | number

type StateOrComputedValues <K extends Key = Key> = {
  [key in K]: State | Cache | Mixer
}

/** @deprecated - use `getDecors` instead of this */
function stateValues (target: object): StateOrComputedValues {
  console.error('The stateValues function will be removed, please use getDecors')
  return getDecors(target)
}

export default stateValues

export {
  stateValues,
  StateOrComputedValues,
}
