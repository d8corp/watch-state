import State from '../../classes/State'
import getDecors, {Target} from '../getDecors'

function getState <T extends Target, F extends keyof T> (target: T, field: F): State<T[F]> {
  return getDecors(target)[field] as State
}

export default getState

export {
  getState,
}
