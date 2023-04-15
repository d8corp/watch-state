import { Observer } from '../../types'

const destroyStack = []
let currentWatcher: Observer

export function destroyWatchers (...watchers: Observer[]) {
  const skipLoop = Boolean(destroyStack.length)
  destroyStack.push(...watchers)

  if (skipLoop) return

  while ((currentWatcher = destroyStack.shift())) {
    currentWatcher.destroyed = true

    for (const destructor of currentWatcher.destructors) {
      destructor()
    }

    currentWatcher.destructors.clear()
    destroyStack.push(...currentWatcher.childWatchers)
    currentWatcher.childWatchers.clear()
  }
}
