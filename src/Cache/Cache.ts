import { scope } from '../constants'
import { destroyWatchers, watchWithScope } from '../helpers'
import { Observable } from '../Observable'
import { Observer } from '../types'
import { Watch } from '../Watch'

export class Cache<V = unknown> extends Observable<V> implements Observer {
  invalid = true
  updated = false
  destroyed = false

  // Observer
  destructors: Set<Function> = new Set()
  childWatchers: Set<Observer> = new Set()

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
      this.update()
    }
  }

  update () {
    this.invalidate()

    if (this.watched) {
      this.forceUpdate()
    }
  }

  forceUpdate () {
    if (!this.destroyed) {
      this.invalid = false

      watchWithScope(this, () => {
        this.rawValue = this.watcher(this.updated ? this.updated = true : false)
      })
    }
  }

  get watched () {
    const parents = [...this.observers]
    let parent: Observer

    while ((parent = parents.pop())) {
      if (parent instanceof Watch) {
        return true
      }

      if (parent instanceof Cache) {
        parents.push(...parent.observers)
      }
    }

    return false
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

  invalidate () {
    this.invalid = true
  }
}
