import {Destructor} from 'src/classes/Watch'
import scope from 'src/utils/scope'

function onDestroy (callback: Destructor): boolean {
  if (scope.activeWatcher) {
    scope.activeWatcher.onDestroy(callback)
    return true
  }
  return false
}

export default onDestroy

export {
  onDestroy,
}
