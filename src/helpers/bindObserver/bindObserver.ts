import { scope } from '../../constants'
import type { Observer } from '../../types'

export function bindObserver (observer: Observer) {
  const { activeWatcher } = scope

  if (activeWatcher) {
    activeWatcher.children.add(observer)

    activeWatcher.destructors.add(() => {
      activeWatcher.children.delete(observer)
    })
  }
}
