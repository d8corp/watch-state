import Cache from 'src/classes/Cache'
import getDecors, {Target} from 'src/utils/getDecors'

function getCache <T extends Target, F extends keyof T> (target: T, field: F): Cache<T[F]> | undefined {
  return getDecors(target)[field] as Cache
}

export default getCache

export {
  getCache,
}
