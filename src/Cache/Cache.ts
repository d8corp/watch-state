import { scope } from '../constants'
import { destroyWatchers, watchWithScope } from '../helpers'
import { Observable } from '../Observable'
import { Observer } from '../types'

export class Cache<V = unknown> extends Observable<V> implements Observer {
  invalid = true
  updated = false

  // Observer
  destructors: Set<Function> = new Set()
  childWatchers: Set<Observer> = new Set()

  readonly watcher: (update: boolean) => V
  constructor (watcher: (update: boolean) => V) {
    super()
    this.watcher = watcher

    const { activeWatcher } = scope

    if (activeWatcher) {
      activeWatcher.childWatchers.add(this)

      activeWatcher.destructors.add(() => {
        activeWatcher.childWatchers.delete(this)
      })
    }
  }

  get value () {
    if (this.invalid) {
      this.invalid = false

      watchWithScope(this, () => {
        this.rawValue = this.watcher(this.updated ? this.updated = true : false)
      })
    }

    return super.value
  }

  destroy () {
    destroyWatchers(this)
  }

  invalidate () {
    this.invalid = true
  }
}
