/** Cleanup function called on observer destruction. */
export type Destructor = () => void

/** Interface defining the contract for reactive observers. */
export interface Observer {
  /**
   * Child observers created within this observer's scope.
   * Used for hierarchical cleanup.
   */
  childrenObservers: Set<Observer>

  /** Cleanup functions to run on destroy (e.g., unsubscribes). */
  destructors: Set<Destructor>

  /** Stop observation and remove all dependencies. */
  destroy: () => void

  /** Force re-run of the observer's logic. */
  update: () => void

  /** Tracks if the computation has run at least once. */
  updated: boolean

  /**
   * Indicates if observer has been destroyed.
   * Prevents accidental use after cleanup.
   */
  destroyed: boolean

  // TODO: remove in major release
  /** @deprecated Use `childrenObservers` */
  childWatchers: Set<Observer>

  // TODO: remove in major release
  /** @deprecated Use `observer instanceof Compute` */
  isCache?: boolean
}

/** Global singleton tracking active watcher and event depth */
export interface Scope {
  /** Currently executing watcher (for auto-subscription) */
  activeWatcher?: Observer

  /** Current nesting depth of events */
  eventDeep: number
}

/** @deprecated `update` argument is deprecated, use `Selector` */
export type Watcher<T> = (update: boolean) => T

/**
 * A function that selects or derives a value from the accessed state.
 * @template T The type of the selected value
 */
export type Selector<T> = () => T
