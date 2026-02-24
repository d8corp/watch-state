/** Cleanup function called on observer destruction. */
export type Destructor = () => void

/** Interface defining the contract for reactive observers. */
export interface Observer {
  /**
   * Child observers created within this observer's scope.
   * Used for hierarchical cleanup.
   */
  children: Set<Observer>

  /** Cleanup functions to run on destroy (e.g., unsubscribes). */
  destructors: Set<Destructor>

  /** Stop observation and remove all dependencies. */
  destroy: () => void

  init: () => void

  /** Force re-run of the observer's logic. */
  update: Reaction<void>

  /** Tracks if the computation has run at least once. */
  updated: boolean

  /**
   * Indicates if observer has been destroyed.
   * Prevents accidental use after cleanup.
   */
  destroyed: boolean

  reaction: Reaction<void>
}

/** Global singleton tracking active watcher and event depth */
export interface Scope {
  /** Currently executing watcher (for auto-subscription) */
  activeWatcher?: Observer
}

/**
 * A reactive function that tracks dependencies and can to derives a value.
 * Used in `Watch` for side effects and in `Compute` for memoized values.
 * @template T The type of the derived value
 */
export type Reaction<T = unknown> = () => T
