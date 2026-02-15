/** Cleanup function called on observer destruction. */
export type Destructor = () => void

export interface Observer {
  childWatchers: Set<Observer>
  destructors: Set<Destructor>
  destroy: () => void
  update: () => void
  destroyed: boolean

  // TODO: remove in major version
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

/** Watcher callback signature. First call: `update=false`, updates: `update=true`. */
export type Watcher<T> = (update: boolean) => T
