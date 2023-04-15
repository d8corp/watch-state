import { scope } from '../constants'
import { Observer } from '../types'

export class Observable<V> {
  readonly observers = new Set<Observer>()
  rawValue: V

  get value () {
    const { activeWatcher } = scope

    if (activeWatcher) {
      this.observers.add(activeWatcher)

      activeWatcher.destructors.add(() => {
        this.observers.delete(activeWatcher)
      })
    }

    return this.rawValue
  }
}
