import {Watch, lock, State} from '.'
import stateValues from './stateValues'

interface ComputedValues {
  [key: string]: Computed
}

class Computed <T = any> {
  state = new State<T>()
  constructor (public target: () => T) {
    new Watch(() => this.state.value = target())
  }
  get value (): T {
    return this.state.value
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
