import { scope } from '../../constants'
import { type Observer } from '../../types'

export function watchWithScope (observer: Observer, target: () => void) {
  const prevObserver = scope.activeWatcher
  scope.activeWatcher = observer
  target()
  scope.activeWatcher = prevObserver
}
