import { queueWatchers } from '../helpers'
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
export class State<V = unknown> extends Observable<V> {
  constructor (initial?: V) {
    super()
    this.rawValue = initial
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

  set value (value: V) {
    if (this.rawValue !== value) {
      this.rawValue = value
      this.update()
    }
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
