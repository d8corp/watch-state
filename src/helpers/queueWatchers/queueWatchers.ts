import { clearWatcher } from '../clearWatchers'

import type { Compute } from '../../Compute'
import { scope } from '../../constants'
import { type Observer } from '../../types'
import { shiftSet } from '../../utils/shiftSet'

let currentCompute: Compute
let currentObserver: Observer
let forcedQueue: boolean

const computeStack = new Set<Compute>()
const observersStack = new Set<Observer>()

export function forceQueueWatchers () {
  if (forcedQueue) return
  forcedQueue = true

  while ((currentCompute = shiftSet(computeStack)) || (currentObserver = shiftSet(observersStack))) {
    if (currentCompute) {
      currentCompute.invalid = true
      continue
    }

    clearWatcher(currentObserver)

    currentObserver.update()
  }

  forcedQueue = false
}

export function queueWatchers (watchers: Set<Observer>) {
  const useLoop = !scope.eventDeep && !observersStack.size && !computeStack.size
  const oldObserversStack = [...observersStack]

  observersStack.clear()

  watchers.forEach(watcher => {
    observersStack.add(watcher)

    if (watcher.isCache) {
      computeStack.add(watcher as Compute)
    }
  })

  oldObserversStack.forEach(observer => observersStack.add(observer))

  if (useLoop) {
    forceQueueWatchers()
  }
}
