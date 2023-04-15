import { scope } from '../constants'
import { Observer } from '../types'

export class Observable<V> {
  readonly watchers = new Set<Observer>()
  rawValue: V

  get value () {
    const { activeWatcher } = scope
    if (activeWatcher) {
      this.watchers.add(activeWatcher)

      activeWatcher.destructors.add(() => {
        this.watchers.delete(activeWatcher)
      })
    }

    return this.rawValue
  }
}
