import { clearWatcher } from '../clearWatchers'

import { Cache } from '../../Cache'
import { scope } from '../../constants'
import { type Observer } from '../../types'
import { shiftSet } from '../../utils'

const cacheStack: Set<Cache> = new Set()
const observersStack: Set<Observer> = new Set()
let currentCache: Cache
let currentObserver: Observer

export function forceQueueWatchers () {
  while ((currentCache = shiftSet(cacheStack)) || (currentObserver = shiftSet(observersStack))) {
    if (currentCache) {
      currentCache.invalid = true
      continue
    }

    clearWatcher(currentObserver)

    currentObserver.update()
  }
}

export function queueWatchers (watchers: Set<Observer>) {
  const useLoop = !scope.eventDeep && !observersStack.size && !cacheStack.size

  watchers.forEach(watcher => {
    observersStack.add(watcher)

    if (watcher instanceof Cache) {
      cacheStack.add(watcher)
    }
  })

  if (!useLoop) {
    return
  }

  forceQueueWatchers()
}
