import { clearWatcher } from '../clearWatchers'

import { type Compute } from '../../Compute'
import { scope } from '../../constants'
import { type Observer } from '../../types'
import { shiftSet } from '../../utils/shiftSet'

const cacheStack = new Set<Compute>()
const observersStack = new Set<Observer>()
let currentCache: Compute
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
  const oldObserversStack = [...observersStack]

  observersStack.clear()

  watchers.forEach(watcher => {
    observersStack.add(watcher)

    if (watcher.isCache) {
      cacheStack.add(watcher as Compute)
    }
  })

  oldObserversStack.forEach(observer => observersStack.add(observer))

  if (useLoop) {
    forceQueueWatchers()
  }
}
