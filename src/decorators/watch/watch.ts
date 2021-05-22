import Watch, {Watcher} from '/classes/Watch'

type Target <P extends string = string> = object & Record<P, Watcher>

function watch <P extends string = string> (target: Target<P>, propertyKey: P): any {
  const origin = target[propertyKey as string]

  return {
    value () {
      return new Watch(origin.bind(this))
    },
    enumerable: true
  }
}

export default watch

export {
  watch,
}
