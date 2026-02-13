import { type Compute } from '../../Compute'
import { type Observer } from '../../types'

const invalidateStack: Observer[] = []
let currentObserver: Observer

export function invalidateCompute (cache: Observer) {
  const skipLoop = invalidateStack.length
  invalidateStack.push(cache)

  if (skipLoop) return

  while ((currentObserver = invalidateStack.shift())) {
    if (currentObserver.isCache) {
      invalidateStack.push(...(currentObserver as Compute).observers)

      ;(currentObserver as Compute).invalid = true
    }
  }
}
