import { type Cache } from '../../Cache'
import { scope } from '../../constants'
import { type Observer } from '../../types'
import { shiftSet } from '../../utils/shiftSet'
import { clearWatcher } from '../clearWatchers'

const cacheStack = new Set<Cache>()
const observersStack = new Set<Observer>()
let currentCache: Cache
let currentObserver: Observer
let forcedQueueWatchers = false

export function forceQueueWatchers () {
  if (forcedQueueWatchers) return
  forcedQueueWatchers = true

  while ((currentCache = shiftSet(cacheStack)) || (currentObserver = shiftSet(observersStack))) {
    if (currentCache) {
      currentCache.invalid = true
      continue
    }

    clearWatcher(currentObserver)

    currentObserver.update()
  }

  forcedQueueWatchers = false
}

export function queueWatchers (watchers: Set<Observer>) {
  const useLoop = !scope.eventDeep && !observersStack.size && !cacheStack.size

  watchers.forEach(watcher => {
    observersStack.add(watcher)

    if (watcher.isCache) {
      cacheStack.add(watcher as Cache)
    }
  })

  if (!useLoop) {
    return
  }

  forceQueueWatchers()
}
