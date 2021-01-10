import scope from '../scope'
import {WatchTarget} from 'src/classes/Watch'

function onDestructor (callback: WatchTarget): boolean {
  if (scope.activeWatcher) {
    scope.activeWatcher.onDestructor(callback)
    return true
  }
  return false
}

export default onDestructor

export {
  onDestructor,
}
