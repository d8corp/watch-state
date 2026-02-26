import { scope } from '../../constants'
import { type Observer } from '../../types'

export function watchWithScope (observer: Observer, target: () => void) {
  const prev = scope.observer
  scope.observer = observer
  target()
  scope.observer = prev
}
