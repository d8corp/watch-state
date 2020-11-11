import stateValues from '../stateValues'
import {unwatch} from '../Watch'
import Computed from '../Computed'

interface ComputedValues {
  [key: string]: Computed
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

export default computed

export {
  computed
}
