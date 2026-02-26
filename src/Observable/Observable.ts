import { scope } from '../constants'
import type { Action } from '../types'
import { batch, batchReaction } from '../utils'

/**
 * Base reactive value **requiring subclasses to implement `update()`** for watcher notifications.
 *
 * Provides automatic observer tracking when `value` is accessed in `Observer` (`State`, `Compute`).
 *
 * @prop raw - Raw value. No auto-subscription on direct access (unlike `value`).
 * @class Observable
 * @template V - state value type
 */
export abstract class Observable<T> {
  /** Set of registered observers */
  readonly reactions = new Set<Action>()

  /** Raw value. No auto-subscription on direct access (unlike `value`). */
  abstract raw: T

  /**
   * Current value with automatic subscription.
   *
   * Accessing `value` inside an `Observer` automatically subscribes the watcher.
   *
   * @example
   * new Watch(() => console.log(state.value)) // auto-subscribes
   */
  get value () {
    const { observer } = scope

    if (observer) {
      this.reactions.add(observer)
      observer.destructors.add(this.off.bind(this, observer))
    }

    return this.raw
  }

  get () {
    return this.value
  }

  on (reaction: Action) {
    this.reactions.add(reaction)

    return this.off.bind(this, reaction)
  }

  off (reaction: Action) {
    this.reactions.delete(reaction)
  }

  /**
   * Force triggers all reactions even if value didn't change.
   *
   * @example
   * // Create state
   * const log = new State([])
   *
   * // Subscribe to changes
   * new Watch(() => console.log(log.value)) // logs: []
   *
   * log.value.push(1) // no logs
   *
   * // Update value
   * count.update() // logs: [1]
   */
  update () {
    const size = this.reactions.size

    if (!size) return

    if (size === 1) {
      batchReaction(this.reactions.values().next().value as Action)

      return
    }

    batch(this._update.bind(this))
  }

  private _update () {
    this.reactions.forEach(batchReaction)
  }
}
