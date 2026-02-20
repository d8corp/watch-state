import { scope } from '../constants'
import { type Observer } from '../types'

/**
 * Base reactive value **requiring subclasses to implement `update()`** for watcher notifications.
 *
 * Provides automatic observer tracking when `value` is accessed in `Observer` (`State`, `Compute`).
 *
 * @class Observable
 * @template V - state value type
 */
export abstract class Observable<V> {
  /** Set of registered observers */
  readonly observers = new Set<Observer>()

  /** Raw value. No auto-subscription on direct access (unlike `value`). */
  abstract rawValue: V

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
      this.observers.add(activeWatcher)

      activeWatcher.destructors.add(() => {
        this.observers.delete(activeWatcher)
      })
    }

    return this.rawValue
  }

  /** Must be implemented by subclasses to notify watchers */
  abstract update (): void
}
