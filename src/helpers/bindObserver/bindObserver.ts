import { scope } from '../../constants'
import type { Observer } from '../../types'

export function bindObserver (observer: Observer) {
  const { activeWatcher } = scope

  if (activeWatcher) {
    activeWatcher.childWatchers.add(observer)

    activeWatcher.destructors.add(() => {
      activeWatcher.childWatchers.delete(observer)
    })
  }
}
