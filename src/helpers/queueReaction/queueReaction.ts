import type { Reaction } from '../../types'

const stack: Reaction[] = []
let working = false

export function queueReaction (reaction: Reaction) {
  if (working) {
    stack.push(reaction)

    return
  }

  working = true
  let currentReaction: Reaction | undefined = reaction

  do {
    currentReaction()
  } while (stack.length && (currentReaction = stack.pop()))

  working = false
}
