export interface Observer {
  childWatchers: Set<Observer>
  destructors: Set<Function>
  destroyed: boolean
}

export interface Scope {
  activeWatcher?: Observer
  eventDeep: number
}
