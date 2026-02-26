/**
 * A reactive function that tracks dependencies and can to derives a value.
 * Used in `Watch` for side effects and in `Compute` for memoized values.
 * @template T The type of the derived value
 */
export type Reaction<T = unknown> = () => T

export type Action = Reaction | Observer

/** Cleanup function called on observer destruction. */
export type Destructor = Reaction<void>

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
  destroy: Reaction<void>

  /** Start observation if the observer destroyed */
  init: Reaction<void>

  /** Force re-run of the observer's reaction. */
  update: Reaction<void>

  /** Tracks if the computation has run at least once. */
  updated: boolean

  /**
   * Indicates if observer has been destroyed.
   * Prevents accidental use after cleanup.
   */
  destroyed: boolean

  /** A reactive function that tracks dependencies and can to derives a value. */
  reaction: Reaction
}

/** Global singleton tracking active watcher and event depth */
export interface Scope {
  /** Currently executing watcher (for auto-subscription) */
  observer?: Observer
}
