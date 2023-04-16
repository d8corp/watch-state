import { Cache } from '../../Cache'
import { Observer } from '../../types'

const invalidateStack: Observer[] = []
let currentObserver: Observer

export function invalidateCache (cache: Observer) {
  const skipLoop = Boolean(invalidateStack.length)
  invalidateStack.push(cache)

  if (skipLoop) return

  while ((currentObserver = invalidateStack.shift())) {
    if (currentObserver instanceof Cache) {
      invalidateStack.push(...currentObserver.observers)
      currentObserver.invalid = true
    }
  }
}
