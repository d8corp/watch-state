import { bindObserver, destroyWatchers, watchWithScope } from '../helpers'
import type { Destructor, Observer, Watcher } from '../types'

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
 * new Watch(() => console.log(count.value))
 *
 * count.value = 1 // triggers watcher callback
 */
export class Watch implements Observer {
  /** Whether the watcher has been destroyed */
  destroyed = false

  /** Cleanup functions to run when watcher is destroyed */
  readonly destructors = new Set<Destructor>()

  /** Child watchers created within this watcher's scope */
  childWatchers = new Set<Observer>()

  constructor (readonly watcher: Watcher<void>, freeParent?: boolean, freeUpdate?: boolean) {
    if (!freeParent) {
      bindObserver(this)
    }

    if (!freeUpdate) {
      watchWithScope(this, () => {
        watcher(false)
      })
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
        this.watcher(true)
      })
    }
  }
}
