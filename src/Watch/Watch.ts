import { bindObserver, destroyWatchers, watchWithScope } from '../helpers'
import type { Destructor, Observer, Reaction, Watcher } from '../types'

/**
 * Watcher class for reactive state tracking.
 * Executes callback function when observed states change.
 * @class Watch
 * @implements {Observer}
 *
 * @example
 * // Create state
 * const count = new State(0)
 *
 * // Create watcher that logs the state changes
 * new Watch(() => console.log(count.value)) // auto-subscribes to count
 *
 * count.value = 1 // triggers watcher callback
 */
export class Watch implements Observer {
  /** Whether the watcher has been destroyed */
  destroyed = false

  /** Tracks if the computation has run at least once. */
  updated = false

  /** Cleanup functions to run when watcher is destroyed */
  readonly destructors = new Set<Destructor>()

  /** Child observers created within this watcher's scope */
  readonly children = new Set<Observer>()

  // TODO: remove in major release
  /** @deprecated Use `children` */
  get childrenObservers () {
    return this.children
  }

  // TODO: remove in major release
  /** @deprecated Use `childrenObservers` */
  get childWatchers () {
    return this.children
  }

  // TODO: remove in major release
  /** @deprecated Use `reaction` */
  get watcher () {
    return this.reaction
  }

  constructor (reaction: Reaction<void>, freeParent?: boolean, freeUpdate?: boolean)
  /** @deprecated `update` argument is deprecated, use `Reaction` */
  constructor (reaction: Watcher<void>, freeParent?: boolean, freeUpdate?: boolean)
  constructor (readonly reaction: Watcher<void> | Reaction<void>, freeParent?: boolean, freeUpdate?: boolean) {
    if (!freeParent) {
      bindObserver(this)
    }

    if (!freeUpdate) {
      this.update()
    }
  }

  /** Destroy watcher and cleanup all dependencies */
  destroy () {
    destroyWatchers(this)
  }

  /** Force watcher update regardless of state changes */
  update () {
    if (!this.destroyed) {
      watchWithScope(this, () => {
        this.reaction(this.updated) // TODO: remove `this.updated` in major release
        this.updated = true
      })
    }
  }
}
