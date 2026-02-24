import { destroyWatchers } from '../helpers/destroyWatchers'
import { watchWithScope } from '../helpers/watchWithScope'
import { useBindObserver } from '../hooks'
import { Observable } from '../Observable'
import type { Destructor, Observer, Reaction } from '../types'

/**
 * Cached reactive computation with memoization.
 * Recalculates value only when dependencies change and when it is actively consumed
 * by a Watcher or another Compute that is itself consumed by a Watcher.
 *
 * This ensures that computations are only evaluated when their output is actually needed,
 * enabling efficient lazy evaluation and automatic subscription management.
 *
 * @class Compute
 * @extends Observable<V>
 * @implements {Observer}
 * @template V - computed value type
 *
 * @example
 * const fullName = new State('Mighty Mike')
 * const name = new Compute(() => fullName.value.split(' ')[1])
 *
 * // Only when accessed inside an `Observer`, `Compute` becomes active:
 *
 * const nameWatcher = new Watch(() => console.log(name.value))
 * // Triggers computation and subscribes to `name`
 *
 * // This does NOT trigger recomputation:
 * console.log(name.value)
 *
 * // If used inside another `Compute` that is watched, it triggers:
 * const greeting = new Compute(() => `${name.value} How are you?`)
 *
 * const greetingWatcher new Watch(() => console.log(greeting.value))
 * // Triggers greeting
 *
 * fullName.value = 'Mighty Michael'
 * // Triggers full chain: fullName → name → greeting → greetingWatcher
 *
 * fullName.value = 'Deight Michael'
 * // Triggers part of chain: fullName → name
 */
export class Compute<V = unknown> extends Observable<V> implements Observer {
  /** Indicates if computed value is stale and needs recalculation. */
  invalid = true

  /** Tracks if the computation has run at least once. */
  updated = false

  // @ts-expect-error This is intentional — accessing destroyed observers is rare and shouldn't require undefined checks in normal code.
  raw: V

  /**
   * Indicates if observer has been destroyed.
   * Prevents accidental use after cleanup.
   */
  destroyed = false

  /** Cleanup functions to run on destroy (e.g., unsubscribes). */
  readonly destructors = new Set<Destructor>()

  /** Child watchers created within this watcher's scope */
  readonly children = new Set<Observer>()

  constructor (readonly reaction: Reaction<V>, freeParent?: boolean, fireImmediately?: boolean) {
    super()

    if (!freeParent) {
      useBindObserver(this)
    }

    if (fireImmediately) {
      this.calculate()
    }
  }

  init () {
    if (!this.destroyed) return

    this.destroyed = false

    if (!this.reactions.size) return

    const prev = this.raw
    this.calculate()

    if (prev !== this.raw) {
      super.update()
    }
  }

  calculate () {
    if (!this.invalid) return

    this.destroy()

    watchWithScope(this, () => {
      this.destroyed = false
      this.raw = this.reaction()
      this.updated = true
      this.invalid = false
    })
  }

  /** Mark computation as invalid and trigger propagation to parent observers. */
  update () {
    this.destroy()
    this.init()
  }

  /**
   * Current value with automatic subscription.
   *
   * Accessing `value` inside an `Observer` automatically subscribes the watcher.
   *
   * @example
   * const count = new State(0)
   * const text = new Compute(() => `Count: ${count.value}`)
   *
   * new Watch(() => console.log(text.value)) // Count: 0
   *
   * count.value++ // Count: 1
   */
  get value () {
    this.calculate()

    return super.value
  }

  /** Stop observation and remove all dependencies. */
  destroy () {
    if (this.destroyed) return

    this.invalid = true
    destroyWatchers(this)
  }
}
