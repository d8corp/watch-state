import {Watch, State, stateValues, unwatch} from './State'

interface ComputedValues {
  [key: string]: Computed
}

class Computed <T = any> {
  _value: State<T> = new State()
  _watcher: Watch
  constructor (public target: () => T) {}
  destructor () {
    this._watcher?.destructor()
  }
  get value (): T {
    if (!this._watcher) {
      unwatch(() => {
        this._watcher = new Watch(update => {
          if (!update || this._value.watchers.size) {
            this._value.value = this.target()
          } else {
            this._watcher = undefined
          }
        })
      })
    }
    return this._value.value
  }
}

function computed (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void
function computed (target, propertyKey, descriptor) {
  const {get: originalGet} = descriptor
  return {
    get () {
      const values: ComputedValues = stateValues(this) as ComputedValues
      if (!(propertyKey in values)) {
        unwatch(() => values[propertyKey] = new Computed(originalGet.bind(this)))
      }
      return values[propertyKey].value
    },
    enumerable: true
  }
}

export default Computed

export {
  Computed,
  computed,
}

export * from './State'
