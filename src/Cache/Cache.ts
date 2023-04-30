import { scope } from '../constants'
import { destroyWatchers, invalidateCache, queueWatchers, watchWithScope } from '../helpers'
import { Observable } from '../Observable'
import { type Observer } from '../types'
import { Watch } from '../Watch'

export class Cache<V = unknown> extends Observable<V> implements Observer {
  invalid = true
  updated = false
  destroyed = false
  isCache = true

  // Observer
  destructors = new Set<Function>()
  childWatchers = new Set<Observer>()

  readonly watcher: (update: boolean) => V
  constructor (watcher: (update: boolean) => V, freeParent?: boolean, fireImmediately?: boolean) {
    super()
    this.watcher = watcher

    if (!freeParent) {
      const { activeWatcher } = scope

      if (activeWatcher) {
        activeWatcher.childWatchers.add(this)

        activeWatcher.destructors.add(() => {
          activeWatcher.childWatchers.delete(this)
        })
      }
    }

    if (fireImmediately) {
      this.forceUpdate()
    }
  }

  update () {
    invalidateCache(this)

    const parents = [...this.observers]
    let parent: Observer

    while ((parent = parents.pop())) {
      if (parent instanceof Watch) {
        return this.forceUpdate()
      }

      if (parent instanceof Cache) {
        parents.push(...parent.observers)
      }
    }
  }

  forceUpdate () {
    if (!this.destroyed) {
      this.invalid = false

      watchWithScope(this, () => {
        const newValue = this.watcher(this.updated ? this.updated = true : false)

        if (newValue !== this.rawValue) {
          this.rawValue = newValue
          queueWatchers(this.observers)
        }
      })
    }
  }

  get value () {
    if (this.invalid) {
      this.forceUpdate()
    }

    return this.destroyed ? this.rawValue : super.value
  }

  destroy () {
    destroyWatchers(this)
  }
}
