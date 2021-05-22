import getDecors from '/utils/getDecors'
import Cache from '/classes/Cache'

interface CachePropertyDescriptor {
  get?: () => any
  set?: (value: any) => void
}

function cache (target: object, propertyKey: string, descriptor: CachePropertyDescriptor): CachePropertyDescriptor {
  const origin = descriptor.get

  if (origin) {
    return {
      get () {
        const decorators = getDecors(this)
        return propertyKey in decorators ?
          decorators[propertyKey].value :
          (decorators[propertyKey] = new Cache(origin.bind(this), false)).value
      }
    }
  }
}

export default cache

export {
  cache
}
