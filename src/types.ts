export interface Observer {
  childWatchers: Set<Observer>
  destructors: Set<Function>
  destroy (): void
}

export interface Scope {
  activeWatcher?: Observer
  eventDeep: number
}
