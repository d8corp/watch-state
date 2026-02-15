import { invalidateCompute } from '../../Compute'
import { type Observer } from '../../types'

/**
 * @deprecated Use `invalidateCompute`
 */
export function invalidateCache (observer: Observer) {
  invalidateCompute(observer)
}
