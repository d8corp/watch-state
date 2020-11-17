import stateValues from '../../utils/stateValues'
import unwatch from '../../utils/unwatch'
import Cache from '../../classes/Cache'

interface ComputedValues {
  [key: string]: Cache
}

function cache (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> {
  const {value, get: originalGet = value} = descriptor
  return {
    get () {
      const values: ComputedValues = stateValues(this) as ComputedValues
      if (!(propertyKey in values)) {
        unwatch(() => values[propertyKey] = new Cache(originalGet.bind(this)))
      }
      return values[propertyKey].value
    },
    enumerable: true
  }
}

export default cache

export {
  cache
}
