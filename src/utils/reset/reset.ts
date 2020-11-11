import scope from '../scope'

function reset () {
  scope.activeWatchers = scope.activeWatcher = undefined
}

export default reset

export {
  reset
}
