import State from '../../classes/State'
import Cache from '../../classes/Cache'
import Mixer from '../../classes/Mixer'
import getDecors from '../getDecors'

interface Types <V = any> {
  state: State<V>
  mixer: Mixer<V>
  cache: Cache<V>
}

/** @deprecated - use getState or getCache or getMixer from @watch-state/mixer */
function getDecor <TT extends keyof Types, T extends object> (target: T, property: keyof T): Types<T[typeof property]>[TT] {
  return getDecors(target)[property] as Types<T[typeof property]>[TT]
}

export default getDecor

export {
  getDecor
}
