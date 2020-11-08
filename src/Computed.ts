import {Watch, State, stateValues, unwatch} from './State'

interface ComputedValues {
  [key: string]: Computed
}

class Computed <T = any> {
  _value: State<T> = new State()
  _watcher: Watch
  constructor (public target: () => T) {}
  destructor () {
    this._watcher.destructor()
  }
  get value (): T {
    if (!this._watcher) {
      unwatch(() => {
        this._watcher = new Watch(() => {
          this._value.value = this.target()
        })
      })
    }
    return this._value.value
  }
}

function computed (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any>
function computed (target, propertyKey, descriptor) {
  const {get} = descriptor
  return Object.assign({}, descriptor, {
    get () {
      const values: ComputedValues = stateValues(this) as ComputedValues
      if (!(propertyKey in values)) {
        unwatch(() => values[propertyKey] = new Computed(get.bind(this)))
      }
      return values[propertyKey].value
    }
  })
}

export default Computed

export {
  Computed,
  computed,
}

export * from './State'
