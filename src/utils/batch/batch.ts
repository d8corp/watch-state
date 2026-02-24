import { shiftSet } from '../shiftSet'

import type { Observer, Reaction } from '../../types'

const stack = new Set<Observer>()
let working = false

export function removeFromBatching (observer: Observer) {
  stack.delete(observer)
}

export function batch (action: Reaction<void> | Observer) {
  if (working) {
    if (typeof action === 'function') {
      action()

      return
    }

    action.destroy()
    stack.add(action)

    return
  }

  working = true
  let reaction: Reaction<void> | Observer | undefined = action

  if (typeof reaction !== 'function') {
    reaction.destroy()
  }

  do {
    if (typeof reaction === 'function') {
      reaction()
    } else {
      reaction.init()
    }
  } while (stack.size && (reaction = shiftSet(stack)))

  working = false
}
