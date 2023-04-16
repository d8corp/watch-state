export interface Observer {
  childWatchers: Set<Observer>
  destructors: Set<Function>
  destroy (): void
  update (): void
  destroyed: boolean
  isCache: boolean
}

export interface Scope {
  activeWatcher?: Observer
  eventDeep: number
}
