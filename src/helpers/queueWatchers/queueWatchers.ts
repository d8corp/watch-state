import { clearWatchers } from '../clearWatchers'

import { Cache } from '../../Cache'
import { scope } from '../../constants'
import { type Observer } from '../../types'

const cacheStack: Cache[] = []
const observersStack: Observer[] = []
let currentCache: Cache
let currentObserver: Observer

export function forceQueueWatchers () {
  while ((currentCache = cacheStack.shift()) || (currentObserver = observersStack.shift())) {
    if (currentCache) {
      currentCache.invalid = true
      continue
    }

    clearWatchers(currentObserver)

    currentObserver.update()
  }
}

export function queueWatchers (watchers: Set<Observer>) {
  const useLoop = !scope.eventDeep && !observersStack.length && !cacheStack.length

  observersStack.push(...watchers)

  for (const watcher of watchers) {
    if (watcher instanceof Cache) {
      cacheStack.push(watcher)
    }
  }

  if (!useLoop) {
    return
  }

  forceQueueWatchers()
}
