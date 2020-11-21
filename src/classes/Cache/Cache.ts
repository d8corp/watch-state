import scope from '../../utils/scope'
import unwatch from '../../utils/unwatch'
import Watch from '../Watch'
import State from '../State'

class Cache <T = any> {
  public state: State<T> = new State<T>()
  public watcher: Watch
  constructor (protected target: () => T) {}
  destructor () {
    const {watcher} = this
    this.watcher = undefined
    watcher?.destructor()
  }
  checkWatcher () {
    if (!this.watcher) {
      unwatch(() => {
        let watcher
        watcher = this.watcher = new Watch(update => {
          if (!watcher || this.watcher === watcher) {
            if (!update || this.state.watchers.size || this.state.caches.size) {
              const oldActiveCache = scope.activeCache
              scope.activeCache = this
              this.state.value = this.target()
              scope.activeCache = oldActiveCache
            } else {
              this.destructor()
            }
          }
        })
      })
    }
  }

  get value (): T {
    this.checkWatcher()
    return this.state.value
  }
}


export default Cache

export {
  Cache,
}
