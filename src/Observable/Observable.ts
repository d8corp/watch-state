import { scope } from '../constants'
import type { Observer, Reaction } from '../types'
import { batch } from '../utils'

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
  readonly reactions = new Set<Reaction<void> | Observer>()

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
    const { activeWatcher } = scope

    if (activeWatcher) {
      this.reactions.add(activeWatcher)
      activeWatcher.destructors.add(() => this.unsubscribe(activeWatcher))
    }

    return this.raw
  }

  get () {
    return this.value
  }

  subscribe (reaction: Reaction<void> | Observer) {
    this.reactions.add(reaction)

    return () => this.unsubscribe(reaction)
  }

  unsubscribe (reaction: Reaction<void> | Observer) {
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
    batch(() => {
      this.reactions.forEach(batch)
    })
  }
}
