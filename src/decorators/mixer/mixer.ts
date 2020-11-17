import stateValues from '../../utils/stateValues'
import unwatch from '../../utils/unwatch'
import Mixer from '../../classes/Mixer'

interface MixerValues {
  [key: string]: Mixer
}

function mixer (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> {
  const {value, get: originalGet = value} = descriptor
  return {
    get () {
      const values: MixerValues = stateValues(this) as MixerValues
      if (!(propertyKey in values)) {
        unwatch(() => values[propertyKey] = new Mixer(originalGet.bind(this)))
      }
      return values[propertyKey].value
    },
    enumerable: true
  }
}

export default mixer

export {
  mixer
}