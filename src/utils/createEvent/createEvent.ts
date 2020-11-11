import scope from '../scope'

function createEvent <T extends Function> (target: T): T {
  return function () {
    if (scope.activeWatchers) {
      return target.apply(this, arguments)
    } else {
      const watchers = scope.activeWatchers = new Set()
      const result = target.apply(this, arguments)
      scope.activeWatchers = undefined
      watchers.forEach(watcher => watcher.update())
      return result
    }
  } as unknown as T
}

export default createEvent

export {
  createEvent,
}
