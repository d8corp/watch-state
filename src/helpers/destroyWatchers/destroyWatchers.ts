import { Observer } from '../../types'
import { shiftSet } from '../../utils'

const destroyStack: Set<Observer> = new Set()
let currentWatcher: Observer

export function destroyWatchers (observer: Observer) {
  const skipLoop = Boolean(destroyStack.size)
  destroyStack.add(observer)

  if (skipLoop) return

  while ((currentWatcher = shiftSet(destroyStack))) {
    currentWatcher.childWatchers.forEach(observer => {
      destroyStack.add(observer)
    })

    for (const destructor of currentWatcher.destructors) {
      currentWatcher.destructors.delete(destructor)
      destructor()
    }

    currentWatcher.destroyed = true
  }
}
