import scope from 'src/utils/scope'

function unwatch (target: Function) {
  const prevWatcher = scope.activeWatcher
  scope.activeWatcher = undefined
  const result = target()
  scope.activeWatcher = prevWatcher
  return result
}

export default unwatch

export {
  unwatch
}
