import getDecors from '../../utils/getDecors'
import unwatch from '../../utils/unwatch'
import Mixer from '../../classes/Mixer'

interface MixerValues {
  [key: string]: Mixer
}

/** @deprecated - use @watch-state/mixer */
function mixer (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> {
  console.error('The mixer decorator will be removed, please use @watch-state/mixer')
  const {value, get: originalGet = value} = descriptor
  return {
    get () {
      const values: MixerValues = getDecors(this) as MixerValues
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
