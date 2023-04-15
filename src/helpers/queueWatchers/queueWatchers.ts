import { destroyWatchers } from '../destroyWatchers'

import { Cache } from '../../Cache'
import { scope } from '../../constants'
import { type Observer } from '../../types'
import { Watch } from '../../Watch'

const cacheStack: Cache[] = []
const watchersStack: Observer[] = []
let currentCache: Cache
let currentWatcher: Observer

export function forceQueueWatchers () {
  while ((currentCache = cacheStack.shift()) || (currentWatcher = watchersStack.shift())) {
    if (currentCache) {
      currentCache.invalidate()
      continue
    }

    if (!currentWatcher.destroyed) {
      if (currentWatcher instanceof Watch) {
        destroyWatchers(...currentWatcher.childWatchers)
        currentWatcher.childWatchers.clear()
        currentWatcher.update()
      }
    }
  }
}

export function queueWatchers (...watchers: Observer[]) {
  const useLoop = !scope.eventDeep && !watchersStack.length && !cacheStack.length

  watchersStack.push(...watchers)

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
