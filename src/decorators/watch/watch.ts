import getDecors from '../../utils/getDecors'
import Watch from '../../classes/Watch'

function watch (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> {
  return descriptor.get ? {
    get () {
      const decorators = getDecors(this)
      return propertyKey in decorators ?
        decorators[propertyKey].value :
        (decorators[propertyKey] = new Watch(descriptor.get.bind(this), true)).value
    },
  } : {
    value () {
      return new Watch(descriptor.value.bind(this))
    },
    enumerable: true
  }
}

export default watch

export {
  watch,
}
