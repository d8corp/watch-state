import {Destructor} from '/classes/Watch'
import scope from '/utils/scope'

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
