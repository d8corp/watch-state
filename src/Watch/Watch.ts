import { destroyWatchers, watchWithScope } from '../helpers'
import { Observer } from '../types'

export class Watch implements Observer {
  // Observer
  destructors: Set<Function> = new Set()
  childWatchers: Set<Observer> = new Set()
  destroyed = false

  readonly watcher: (update: boolean) => void
  constructor (watcher: (update: boolean) => void) {
    this.watcher = watcher

    watchWithScope(this, () => {
      watcher(false)
    })
  }

  destroy () {
    destroyWatchers(this)
  }

  update () {
    watchWithScope(this, () => {
      this.watcher(true)
    })
  }
}
