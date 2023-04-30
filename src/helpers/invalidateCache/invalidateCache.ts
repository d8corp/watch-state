import { type Cache } from '../../Cache'
import { type Observer } from '../../types'

const invalidateStack: Observer[] = []
let currentObserver: Observer

export function invalidateCache (cache: Observer) {
  const skipLoop = Boolean(invalidateStack.length)
  invalidateStack.push(cache)

  if (skipLoop) return

  while ((currentObserver = invalidateStack.shift())) {
    if (currentObserver.isCache) {
      invalidateStack.push(...(currentObserver as Cache).observers)
      ;(currentObserver as Cache).invalid = true
    }
  }
}
