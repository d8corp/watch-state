import { type Observer } from '../../types'

const destroyStack: Observer[] = []
let currentWatcher: Observer

export function destroyWatchers (observer: Observer) {
  const skipLoop = Boolean(destroyStack.length)
  destroyStack.push(observer)

  if (skipLoop) return

  while ((currentWatcher = destroyStack.shift())) {
    currentWatcher.childWatchers.forEach(observer => {
      destroyStack.push(observer)
    })

    for (const destructor of currentWatcher.destructors) {
      currentWatcher.destructors.delete(destructor)
      destructor()
    }

    currentWatcher.destroyed = true
  }
}
