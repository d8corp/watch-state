import { shiftSet } from '../shiftSet'

import type { Action } from '../../types'

const stack = new Set<Action>()
let working = false

export function removeFromBatching (action: Action) {
  stack.delete(action)
}

export function batchReaction (action: Action) {
  if (working && typeof action === 'function') {
    stack.add(action)

    return
  }

  batch(action)
}

/**
 * Executes an action in batch mode, collecting observers for deferred execution.
 *
 * @param action - Either a reaction function to execute or an observer to batch
 *
 * @example Batch multiple state updates
 * ```ts
 * batch(() => {
 *   state1.value = 1
 *   state2.value = 2
 * })
 * ```
 */
export function batch (action: Action) {
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
  let reaction: Action | undefined = action

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
