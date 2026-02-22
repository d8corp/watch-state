import { queueWatchers } from '../Compute'
import { Observable } from '../Observable'

/**
 * Reactive state that can be changed via `value` field with change tracking capability.
 *
 * @class State
 * @extends Observable
 * @template V - state value type
 * @param {V} [initial] - initial state value
 *
 * @example
 * // Create state
 * const count = new State(0)
 *
 * // Subscribe to changes
 * new Watch(() => console.log(count.value)) // logs: 0
 *
 * // Update value
 * count.value++ // logs: 1
 */
export class State<V = never | unknown> extends Observable<V extends never ? unknown : V> {
  /** Current value. No auto-subscription on direct access (unlike `value`). */
  raw: V extends never ? unknown : V

  /**
   * Initial state value set during construction.
   * Used by `reset()` to restore state to its original value.
   * Allows checking if the state has been modified.
   *
   * @example
   * const count = new State(0)
   *
 * const isChanged = count.initial === count.raw
   */
  readonly initial: V extends never ? unknown : V

  constructor (...args: V extends never | undefined ? [V?] : [V])
  constructor (initial?: any) {
    super()
    this.raw = this.initial = initial
  }

  /**
   * Current state value. Updates watchers only on actual changes (strict `!==`).
   * Using `value` inside a `Watch` callback automatically subscribes to changes.
   *
   * @example
   * new Watch(() => console.log(count.value)) // auto-subscribes to count
   *
   * @example
   * count.value = 1 // triggers watchers
   * count.value = 1 // no trigger
   */
  get value () {
    return super.value
  }

  set value (value: V extends never ? unknown : V) {
    if (this.raw !== value) {
      this.raw = value
      this.update()
    }
  }

  /**
   * Sets the state value. Identical to the `value` setter but returns `void`.
   * Useful as a shorthand in arrow functions: `() => state.set(value)` instead of `() => { state.value = value }`
   *
   * `state.set` cannot be used as a standalone function: `const set = state.set`
   */
  set (value: V extends never ? unknown : V) {
    this.value = value
  }

  /**
   * Resets state to its initial value.
   * Triggers watchers only if the current value differs from the initial value.
   *
   * @example
   * const count = new State(0)
   *
   * new Watch(() => console.log(count.value)) // logs: 0
   *
   * count.value = 5 // logs: 5
   *
   * count.reset() // logs: 0
   */
  reset () {
    this.value = this.initial
  }

  /**
   * Force triggers all watchers even if value didn't change.
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
    queueWatchers(this.observers)
  }
}
