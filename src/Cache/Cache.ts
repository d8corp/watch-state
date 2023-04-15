import { destroyWatchers, watchWithScope } from '../helpers'
import { Observable } from '../Observable'
import { Observer } from '../types'

export class Cache<V = unknown> extends Observable<V> implements Observer {
  // Observer
  destructors: Set<Function> = new Set()
  childWatchers: Set<Observer> = new Set()
  destroyed = false

  readonly watcher: (update: boolean) => V
  invalid = true
  updated = false
  constructor (watcher: (update: boolean) => V) {
    super()
    this.watcher = watcher
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
