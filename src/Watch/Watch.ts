import { scope } from '../constants'
import { destroyWatchers, watchWithScope } from '../helpers'
import { Observer } from '../types'

export class Watch implements Observer {
  // Observer
  destructors: Set<Function> = new Set()
  childWatchers: Set<Observer> = new Set()
  destroyed = false
  isCache = false

  readonly watcher: (update: boolean) => void
  constructor (watcher: (update: boolean) => void, freeParent?: boolean, freeUpdate?: boolean) {
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
