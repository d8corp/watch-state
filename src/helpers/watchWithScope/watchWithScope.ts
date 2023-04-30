import { scope } from '../../constants'
import { type Observer } from '../../types'

export function watchWithScope (watcher: Observer, target: () => void) {
  const prevWatcher = scope.activeWatcher
  scope.activeWatcher = watcher
  target()
  scope.activeWatcher = prevWatcher
}
