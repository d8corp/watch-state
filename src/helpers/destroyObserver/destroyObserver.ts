import type { Destructor, Observer } from '../../types'
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

    let destructor: Destructor | undefined

    // eslint-disable-next-line no-cond-assign
    while (destructor = currentObserver.destructors.pop()) {
      destructor()
    }

    currentObserver.destroyed = true
    removeFromBatching(currentObserver)
  } while ((currentObserver = stack.shift()))

  working = false
}
