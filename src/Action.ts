import scope from './Scope'

function action <T> (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void
function action <T> (callback: T): T
function action (target, propertyKey?, descriptor?) {
  if (typeof target === 'function') {
    return function () {
      if (scope.actionWatchers) {
        return target.apply(this, arguments)
      } else {
        const watchers = scope.actionWatchers = new Set()
        const result = target.apply(this, arguments)
        scope.actionWatchers = undefined
        watchers.forEach(watcher => watcher.update())
        return result
      }
    }
  } else {
    return Object.assign({}, descriptor, {
      value: action(descriptor.value)
    })
  }
}

export default action

export {
  action
}
