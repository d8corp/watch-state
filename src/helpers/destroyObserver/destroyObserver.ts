import { type Observer } from '../../types'
import { removeFromBatching } from '../../utils'

const stack: Observer[] = []
let working = false

function remove (observer: Observer) {
  stack.push(observer)
}

export function destroyObserver (observer: Observer) {
  if (working) {
    stack.push(observer)

    return
  }

  working = true
  let currentObserver: Observer | undefined = observer

  do {
    currentObserver.children.forEach(remove)

    for (const destructor of currentObserver.destructors) {
      currentObserver.destructors.delete(destructor)
      destructor()
    }

    currentObserver.destroyed = true
    removeFromBatching(currentObserver)
  } while ((currentObserver = stack.shift()))

  working = false
}
