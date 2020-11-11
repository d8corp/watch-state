import {Watch, onClear, scope} from './Watch'
import stateValues from './stateValues'

class State <T = any> {
  private _watchers: Set<Watch>
  private target: T
  constructor(value?: T) {
    this.target = value
  }
  get value (): T {
    const {activeWatcher} = scope
    const {watchers} = this
    if (activeWatcher && !watchers.has(activeWatcher)) {
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
      this.update()
    }
  }
  update () {
    const {watchers} = this
    if (watchers.size) {
      this._watchers = undefined
      if (scope.actionWatchers) {
        watchers.forEach(watcher => scope.actionWatchers.add(watcher))
      } else {
        watchers.forEach(watcher => watcher.update())
      }
    }
  }
  get watchers (): Set<Watch> {
    return this._watchers || (this._watchers = new Set())
  }
}

interface StateValues {
  [key: string]: State
}

function state (target: Object, propertyKey: PropertyKey): void
function state (target, propertyKey, desc?) {
  const value = desc ? desc.value || desc.initializer() : undefined
  return {
    get (): any {
      const values = stateValues(this)
      if (!(propertyKey in values)) {
        values[propertyKey] = new State(value)
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
  }
}

export default State

export {
  State,
  state,
}

export * from './Watch'
export * from './stateValues'
