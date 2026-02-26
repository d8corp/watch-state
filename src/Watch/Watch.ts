import { destroyObserver, queueReaction, watchWithScope } from '../helpers'
import { useBindObserver } from '../hooks'
import type { Destructor, Observer, Reaction } from '../types'

/**
 * Watcher class for reactive state tracking.
 * Executes reaction when observed states change.
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
  destroyed = true

  /** Tracks if the computation has run at least once. */
  updated = false

  /** Cleanup functions to run when watcher is destroyed */
  readonly destructors = new Set<Destructor>()

  /** Child observers created within this watcher's scope */
  readonly children = new Set<Observer>()

  constructor (readonly reaction: Reaction, preventBinding?: boolean, preventInit?: boolean) {
    if (!preventBinding) {
      useBindObserver(this)
    }

    if (!preventInit) {
      this.init()
    }
  }

  private _reaction () {
    this.reaction()
    this.updated = true
  }

  private _reactionWithScope () {
    watchWithScope(this, this._reaction.bind(this))
  }

  /** Init watcher and call reaction */
  init () {
    if (!this.destroyed) return

    this.destroyed = false

    queueReaction(this._reactionWithScope.bind(this))
  }

  /** Destroy watcher and cleanup all dependencies */
  destroy () {
    if (this.destroyed) return

    destroyObserver(this)
  }

  /** Force watcher update regardless of state changes */
  update () {
    if (this.destroyed) return
    this.destroy()
    this.init()
  }
}
