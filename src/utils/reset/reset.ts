import scope from '/utils/scope'

function reset () {
  scope.eventWatchers = scope.activeWatcher = undefined
}

export default reset

export {
  reset
}
