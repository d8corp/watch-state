export interface Observer {
  childWatchers: Set<Observer>
  destructors: Set<Function>
  destroy: () => void
  update: () => void
  destroyed: boolean
  isCache: boolean
}

export interface Scope {
  activeWatcher?: Observer
  eventDeep: number
}

export type Watcher<T> = (update: boolean) => T
