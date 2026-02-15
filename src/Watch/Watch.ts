import { bindObserver, destroyWatchers, watchWithScope } from '../helpers'
import type { Destructor, Observer, Watcher } from '../types'

export class Watch implements Observer {
  destroyed = false
  destructors = new Set<Destructor>()
  childWatchers = new Set<Observer>()

  constructor (readonly watcher: Watcher<void>, freeParent?: boolean, freeUpdate?: boolean) {
    if (!freeParent) {
      bindObserver(this)
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
