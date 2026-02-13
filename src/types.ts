export type Destructor = () => void

export interface Observer {
  childWatchers: Set<Observer>
  destructors: Set<Destructor>
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
