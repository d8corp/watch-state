import { type Observer } from '../../types'
import { removeFromBatching } from '../../utils'

const stack: Observer[] = []
let working = false

export function destroyWatchers (observer: Observer) {
  if (working) {
    stack.push(observer)

    return
  }

  working = true
  let currentObserver: Observer | undefined = observer

  do {
    currentObserver.children.forEach(observer => {
      stack.push(observer)
    })

    for (const destructor of currentObserver.destructors) {
      currentObserver.destructors.delete(destructor)
      destructor()
    }

    currentObserver.destroyed = true
    removeFromBatching(currentObserver)
  } while ((currentObserver = stack.shift()))

  working = false
}
