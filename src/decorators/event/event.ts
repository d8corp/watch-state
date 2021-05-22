import createEvent from 'src/utils/createEvent'

export default function event <T extends Function> (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> {
  return {
    value: createEvent<T>(descriptor.value) as unknown as T,
    enumerable: true
  }
}

export {
  event,
}
