import {Watch, onClear, scope} from './Watch'
import stateValues from './stateValues'

class State <T = any> {
  private watchers: Set<Watch> = new Set()
  constructor(private target?: T) {}
  get value (): T {
    const {activeWatcher} = scope
    const {watchers} = this
    if (activeWatcher && !this.watchers.has(activeWatcher)) {
      watchers.add(activeWatcher)
      onClear(update => {
        if (!update || watchers === this.watchers) {
          watchers.delete(activeWatcher)
        }
      })
    }
    return this.target
  }
  set value (value: T) {
    if (value !== this.target) {
      this.target = value
      const {watchers} = this
      if (watchers.size) {
        this.watchers = new Set()
        if (scope.actionWatchers) {
          watchers.forEach(watcher => scope.actionWatchers.add(watcher))
        } else {
          watchers.forEach(watcher => watcher.update())
        }
      }
    }
  }
}

interface StateValues {
  [key: string]: State
}

function state (target: Object, propertyKey: PropertyKey): void
function state (target, propertyKey) {
  Object.defineProperty(target, propertyKey, {
    get (): any {
      const values = stateValues(this)
      if (!(propertyKey in values)) {
        values[propertyKey] = new State()
      }
      return values[propertyKey].value
    },
    set (v: any): void {
      const values: StateValues = stateValues(this) as StateValues
      if (!(propertyKey in values)) {
        values[propertyKey] = new State(v)
      } else {
        values[propertyKey].value = v
      }
    },
    enumerable: true
  })
}

export default State

export {
  State,
  state,
}

export * from './Watch'
export * from './stateValues'
