import Cache from '../../classes/Cache'
import getDecors, {Target} from '../getDecors'

function getCache <T extends Target, F extends keyof T> (target: T, field: F): Cache<T[F]> | undefined {
  return getDecors(target)[field] as Cache
}

export default getCache

export {
  getCache,
}
