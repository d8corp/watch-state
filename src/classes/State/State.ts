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
  getValue (): T {
    const {activeWatcher, activeCache} = scope
    const {watchers, caches} = this

    if (activeWatcher) {
      if (activeCache) {
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
  setValue (value: T) {
    if (value !== this.target) {
      this.target = value
      this.update()
    }
  }
  public get value (): T {
    return this.getValue()
  }
  public set value (value: T) {
    this.setValue(value)
  }
  update () {
    this.updateCache()
    const {watchers} = this
    if (watchers.size) {
      this.watchers = new Set()
      if (scope.activeWatchers) {
        watchers.forEach(watcher => scope.activeWatchers.add(watcher))
      } else {
        watchers.forEach(watcher => watcher.update())
      }
    }
  }
  updateCache () {
    const {caches} = this
    if (caches.size) {
      this.caches = new Set()
      const watchers = checkCaches(caches)
      createEvent(() => watchers.forEach(cache => cache.checkWatcher()))()
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
      cache.watcher = undefined
    }
  })
  return watchers
}
