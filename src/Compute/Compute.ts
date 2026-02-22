import { scope } from '../constants'
import { bindObserver } from '../helpers/bindObserver'
import { clearWatcher } from '../helpers/clearWatcher'
import { destroyWatchers } from '../helpers/destroyWatchers'
import { watchWithScope } from '../helpers/watchWithScope'
import { Observable } from '../Observable'
import type { Destructor, Observer, Reaction, Watcher } from '../types'
import { shiftSet } from '../utils/shiftSet'

/* queue */

let currentCompute: Compute
let currentObserver: Observer
let forcedQueue: boolean

const computeStack = new Set<Compute>()
const observersStack = new Set<Observer>()

export function forceQueueWatchers () {
  if (forcedQueue) return
  forcedQueue = true

  while ((currentCompute = shiftSet(computeStack)) || (currentObserver = shiftSet(observersStack))) {
    if (currentCompute) {
      currentCompute.invalid = true
      continue
    }

    clearWatcher(currentObserver)

    currentObserver.update()
  }

  forcedQueue = false
}

export function queueWatchers (observers: Set<Observer>) {
  const useLoop = !scope.eventDeep && !observersStack.size && !computeStack.size
  const oldObserversStack = [...observersStack]

  observersStack.clear()

  observers.forEach(watcher => {
    observersStack.add(watcher)

    if (watcher instanceof Compute) {
      computeStack.add(watcher)
    }
  })

  oldObserversStack.forEach(observer => observersStack.add(observer))

  if (useLoop) {
    forceQueueWatchers()
  }
}

/* invalidateCompute */

const invalidateStack: Observer[] = []
let currentInvalidateObserver: Observer | undefined

export function invalidateCompute (observer: Observer) {
  const skipLoop = invalidateStack.length
  invalidateStack.push(observer)

  if (skipLoop) return

  while ((currentInvalidateObserver = invalidateStack.shift())) {
    if (currentInvalidateObserver instanceof Compute) {
      invalidateStack.push(...currentInvalidateObserver.observers)

      currentInvalidateObserver.invalid = true
    }
  }
}

/* Compute */

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

  // TODO: remove in major release
  /** @deprecated Use `observer instanceof Compute` */
  isCache = true

  /** Cleanup functions to run on destroy (e.g., unsubscribes). */
  readonly destructors = new Set<Destructor>()

  /** Child watchers created within this watcher's scope */
  readonly childrenObservers = new Set<Observer>()

  // TODO: remove in major release
  /** @deprecated Use `childrenObservers` */
  get childWatchers () {
    return this.childrenObservers
  }

  // TODO: remove in major release
  /** @deprecated Use `reaction` */
  get watcher () {
    return this.reaction
  }

  constructor (reaction: Reaction<V>, freeParent?: boolean, fireImmediately?: boolean)
  /** @deprecated `update` argument is deprecated, use `Reaction` */
  constructor (reaction: Watcher<V>, freeParent?: boolean, fireImmediately?: boolean)
  constructor (readonly reaction: Watcher<V> | Reaction<V>, freeParent?: boolean, fireImmediately?: boolean) {
    super()

    if (!freeParent) {
      bindObserver(this)
    }

    if (fireImmediately) {
      this.forceUpdate()
    }
  }

  /** Mark computation as invalid and trigger propagation to parent observers. */
  update () {
    invalidateCompute(this)

    const parents = [...this.observers]
    let parent: Observer | undefined

    while ((parent = parents.pop())) {
      if (!(parent instanceof Compute)) {
        return this.forceUpdate()
      }

      parents.push(...parent.observers)
    }
  }

  forceUpdate () {
    if (!this.destroyed) {
      this.invalid = false

      watchWithScope(this, () => {
        const newValue = this.reaction(this.updated) // TODO: remove `this.updated` in major release
        this.updated = true

        if (newValue !== this.raw) {
          this.raw = newValue
          queueWatchers(this.observers)
        }
      })
    }
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
    if (this.invalid) {
      this.forceUpdate()
    }

    return this.destroyed ? this.raw : super.value
  }

  /** Stop observation and remove all dependencies. */
  destroy () {
    destroyWatchers(this)
  }
}
