import scope from './Scope'

function reset () {
  scope.actionWatchers = scope.activeWatcher = undefined
}

function lock (target) {
  const prevWatcher = scope.activeWatcher
  scope.activeWatcher = undefined
  const result = target()
  scope.activeWatcher = prevWatcher
  return result
}

export {
  reset,
  lock
}
