import unwatch from '../../utils/unwatch'
import Watch from '../Watch'
import State from '../State'

class Cache <T = any> {
  _value: State<T> = new State()
  _watcher: Watch
  constructor (public target: () => T) {}
  destructor () {
    this._watcher?.destructor()
  }
  get value (): T {
    if (!this._watcher) {
      unwatch(() => {
        this._watcher = new Watch(update => {
          if (!update || this._value.watchers.size) {
            this._value.value = this.target()
          } else {
            this._watcher = undefined
          }
        })
      })
    }
    return this._value.value
  }
}


export default Cache

export {
  Cache,
}
