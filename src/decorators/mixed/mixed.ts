import stateValues from '../../utils/stateValues'
import unwatch from '../../utils/unwatch'
import Mixed from '../../classes/Mixed'

interface MixedValues {
  [key: string]: Mixed
}

function mixed (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> {
  const {value, get: originalGet = value} = descriptor
  return {
    get () {
      const values: MixedValues = stateValues(this) as MixedValues
      if (!(propertyKey in values)) {
        unwatch(() => values[propertyKey] = new Mixed(originalGet.bind(this)))
      }
      return values[propertyKey].value
    },
    enumerable: true
  }
}

export default mixed

export {
  mixed
}
