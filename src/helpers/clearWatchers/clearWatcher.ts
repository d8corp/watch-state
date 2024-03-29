import { type Observer } from '../../types'
import { destroyWatchers } from '../destroyWatchers'

const clearStack = []
let currentWatcher: Observer

export function clearWatcher (watcher: Observer) {
  const skipLoop = Boolean(clearStack.length)
  clearStack.push(watcher)

  if (skipLoop) return

  while ((currentWatcher = clearStack.shift())) {
    currentWatcher.childWatchers.forEach(destroyWatchers)

    for (const destructor of currentWatcher.destructors) {
      currentWatcher.destructors.delete(destructor)
      destructor()
    }
  }
}
