import scope from '/utils/scope'

function createEvent <T extends Function> (target: T): T {
  return function () {
    if (scope.eventWatchers) {
      return target.apply(this, arguments)
    } else {
      const {activeWatcher} = scope
      scope.activeWatcher = undefined
      const watchers = scope.eventWatchers = new Set()
      const result = target.apply(this, arguments)
      scope.eventWatchers = undefined
      watchers.forEach(watcher => {

        watcher.update()
      })
      scope.activeWatcher = activeWatcher
      return result
    }
  } as unknown as T
}

export default createEvent

export {
  createEvent,
}
