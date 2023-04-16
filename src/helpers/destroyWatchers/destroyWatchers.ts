import { Observer } from '../../types'

const destroyStack = []
let currentWatcher: Observer

export function destroyWatchers (...watchers: Observer[]) {
  const skipLoop = Boolean(destroyStack.length)
  destroyStack.push(...watchers)

  if (skipLoop) return

  while ((currentWatcher = destroyStack.shift())) {
    destroyStack.push(...currentWatcher.childWatchers)

    for (const destructor of currentWatcher.destructors) {
      currentWatcher.destructors.delete(destructor)
      destructor()
    }

    currentWatcher.destroyed = true
  }
}
