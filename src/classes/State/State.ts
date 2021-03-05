import scope from '../../utils/scope'
import createEvent from '../../utils/createEvent'
import Cache from '../Cache'
import Watch from '../Watch'

export class State <T = any> {
  public watchers: Set<Watch> = new Set()
  public caches: Set<Cache> = new Set()
  public target: T
  constructor (value?: T) {
    this.target = value
  }
  public get value (): T {
    const {activeWatcher, activeCache} = scope

    if (activeWatcher) {
      const {watchers} = this

      if (activeCache) {
        const {caches} = this
        if (!caches.has(activeCache)) {
          caches.add(activeCache)
          activeWatcher.onClear(update => {
            if (!update || caches === this.caches) {
              caches.delete(activeCache)
            }
          })
        }
      } else if (!watchers.has(activeWatcher)) {
        watchers.add(activeWatcher)
        activeWatcher.onClear(update => {
          if (!update || watchers === this.watchers) {
            watchers.delete(activeWatcher)
          }
        })
      }
    }
    return this.target
  }
  public set value (value: T) {
    if (value !== this.target) {
      this.target = value
      const {activeWatcher} = scope
      scope.activeWatcher = undefined
      this.update()
      scope.activeWatcher = activeWatcher
    }
  }
  update () {
    const caches = this.updateCache()
    const {watchers} = this
    if (watchers.size) {
      this.watchers = new Set()
      if (scope.eventWatchers) {
        watchers.forEach(watcher => scope.eventWatchers.add(watcher))
      } else {
        watchers.forEach(watcher => watcher.update())
      }
    }
    if (caches) {
      createEvent(() => caches.forEach(cache => cache.checkWatcher()))()
    }
  }
  updateCache () {
    const {caches} = this
    if (caches.size) {
      this.caches = new Set()
      return checkCaches(caches)
    }
  }
}

export default State


function checkCaches (caches: Set<Cache>, watchers: Cache[] = []): Cache[] {
  caches.forEach(cache => {
    const {watcher, state} = cache
    if (watcher) {
      if (state.watchers.size) {
        watchers.push(cache)
      }
      if (state.caches.size) {
        checkCaches(state.caches, watchers)
      }
      cache.destructor()
    }
  })
  return watchers
}
