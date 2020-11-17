import Watch, {WatchTarget} from '../../classes/Watch'

function watch (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<WatchTarget>): TypedPropertyDescriptor<() => Watch> {
  return {
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
