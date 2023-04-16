import { destroyWatchers } from '../destroyWatchers'

import { Observer } from '../../types'

const clearStack = []
let currentWatcher: Observer

export function clearWatchers (...watchers: Observer[]) {
  const skipLoop = Boolean(clearStack.length)
  clearStack.push(...watchers)

  if (skipLoop) return

  while ((currentWatcher = clearStack.shift())) {
    currentWatcher.childWatchers.forEach(destroyWatchers)

    for (const destructor of currentWatcher.destructors) {
      currentWatcher.destructors.delete(destructor)
      destructor()
    }
  }
}
