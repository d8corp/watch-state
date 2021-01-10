import scope from '../scope'
import {WatchTarget} from 'src/classes/Watch'

function onClear (callback: WatchTarget): boolean {
  if (scope.activeWatcher) {
    scope.activeWatcher.onClear(callback)
    return true
  }
  return false
}

export default onClear

export {
  onClear,
}
