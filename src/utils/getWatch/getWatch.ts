import {Watch} from '../../classes'
import getDecors, {Target} from '../getDecors'

function getWatch <T extends Target, F extends keyof T> (target: T, field: F): Watch<T[F]> {
  return getDecors(target)[field] as Watch
}

export default getWatch

export {
  getWatch,
}
