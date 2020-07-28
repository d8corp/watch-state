import {Watch, lock, State, destructor} from '.'
import stateValues from './stateValues'

interface ComputedValues {
  [key: string]: Computed
}

class Computed <T = any> {
  _value: State<T> = new State()
  _watchersCount = 0
  _watcher: Watch
  constructor (public target: () => T) {}
  get value (): T {
    if (destructor(() => {
      this._watchersCount--
      if (!this._watchersCount) {
        this._watcher.destructor()
      }
    })) {
      this._watchersCount++
    }
    if (!this._watchersCount) {
      return this.target()
    }
    if (!this._watcher) {
      lock(() => {
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
  return {
    ...descriptor,
    get () {
      const values: ComputedValues = stateValues(this) as ComputedValues
      if (!(propertyKey in values)) {
        lock(() => values[propertyKey] = new Computed(get.bind(this)))
      }
      return values[propertyKey].value
    }
  }
}

export default Computed

export {
  computed
}
