import State from '../../classes/State'
import Cache from '../../classes/Cache'
import Mixer from '../../classes/Mixer'

const VALUES = Symbol('state values')

interface Types <V = any> {
  state: State<V>
  cache: Cache<V>
  mixer: Mixer<V>
}

type Key = string | number | symbol

type Mapping <K extends Key = Key> = Record<K, keyof Types>
type Target <K extends Key = Key> = Record<K, any>

type Decors <K extends Mapping, T extends Target<keyof K>> = {
  [key in keyof K]: Types<T[key]>[K[key]]
}

function getDecors <K extends Mapping, T extends Target> (target: T): Decors<K, T> {
  if (!(VALUES in target)) {
    // @ts-ignore
    target[VALUES] = {} as Decors<K, T>
  }
  return target[VALUES as keyof T]
}

export default getDecors

export {
  getDecors,
  Decors,
}
