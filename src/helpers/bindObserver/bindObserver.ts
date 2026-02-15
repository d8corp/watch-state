import { scope } from '../../constants'
import type { Observer } from '../../types'

export function bindObserver (observer: Observer) {
  const { activeWatcher } = scope

  if (activeWatcher) {
    activeWatcher.childrenObservers.add(observer)

    activeWatcher.destructors.add(() => {
      activeWatcher.childrenObservers.delete(observer)
    })
  }
}
