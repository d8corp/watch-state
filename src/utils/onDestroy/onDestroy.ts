import scope from '../scope'
import {Destructor} from 'src/classes/Watch'

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
