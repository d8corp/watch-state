import { scope } from '../constants'
import { destroyWatchers, watchWithScope } from '../helpers'
import { Observer } from '../types'

export class Watch implements Observer {
  // Observer
  destructors: Set<Function> = new Set()
  childWatchers: Set<Observer> = new Set()

  readonly watcher: (update: boolean) => void
  constructor (watcher: (update: boolean) => void) {
    this.watcher = watcher
    const { activeWatcher } = scope

    if (activeWatcher) {
      activeWatcher.childWatchers.add(this)

      activeWatcher.destructors.add(() => {
        activeWatcher.childWatchers.delete(this)
      })
    }

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
