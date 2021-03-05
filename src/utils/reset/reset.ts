import scope from '../scope'

function reset () {
  scope.eventWatchers = scope.activeWatcher = undefined
}

export default reset

export {
  reset
}
