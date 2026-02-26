import { scope } from '../../constants'
import { bindObserver } from '../../helpers'
import type { Observer } from '../../types'

export function useBindObserver (observer: Observer) {
  const parentObserver = scope.observer

  if (parentObserver) {
    bindObserver(parentObserver, observer)
  }
}
