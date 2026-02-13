import { scope } from '../constants'
import { destroyWatchers, watchWithScope } from '../helpers'
import type { Destructor, Observer, Watcher } from '../types'

export class Watch implements Observer {
  // Observer
  destructors = new Set<Destructor>()
  childWatchers = new Set<Observer>()
  destroyed = false
  isCache = false

  readonly watcher: Watcher<void>
  constructor (watcher: Watcher<void>, freeParent?: boolean, freeUpdate?: boolean) {
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

    if (!freeUpdate) {
      watchWithScope(this, () => {
        watcher(false)
      })
    }
  }

  destroy () {
    destroyWatchers(this)
  }

  update () {
    if (!this.destroyed) {
      watchWithScope(this, () => {
        this.watcher(true)
      })
    }
  }
}
