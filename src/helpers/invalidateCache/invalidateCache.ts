import { Cache } from '../../Cache'
import { Observer } from '../../types'

const invalidateStack: Observer[] = []
let currentObserver: Observer

export function invalidateCache (...caches: Observer[]) {
  const skipLoop = Boolean(invalidateStack.length)
  invalidateStack.push(...caches)

  if (skipLoop) return

  while ((currentObserver = invalidateStack.shift())) {
    if (currentObserver instanceof Cache) {
      invalidateStack.push(...currentObserver.observers)
      currentObserver.invalid = true
    }
  }
}
