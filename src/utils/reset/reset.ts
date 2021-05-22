import scope from 'src/utils/scope'

function reset () {
  scope.eventWatchers = scope.activeWatcher = undefined
}

export default reset

export {
  reset
}
