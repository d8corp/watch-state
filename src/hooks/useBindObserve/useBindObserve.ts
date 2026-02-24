import { scope } from '../../constants'
import { bindObserver } from '../../helpers'
import type { Observer } from '../../types'

export function useBindObserver (observer: Observer) {
  const { activeWatcher } = scope

  if (activeWatcher) {
    bindObserver(activeWatcher, observer)
  }
}
