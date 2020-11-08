import scope from './Scope'

function reset () {
  scope.actionWatchers = scope.activeWatcher = undefined
}

export {
  reset
}
