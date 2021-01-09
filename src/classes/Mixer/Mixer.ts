import unwatch from '../../utils/unwatch'
import onClear from '../../utils/onClear'
import Watch from '../Watch'
import State from '../State'
import scope from '../../utils/scope'

/** @deprecated - use @watch-state/mixer */
class Mixer <T = any> {
  public state: State<T> = new State<T>()
  public watcher: Watch
  constructor (protected target: () => T) {}
  destructor () {
    this.watcher?.destructor()
    this.watcher = undefined
  }
  checkWatcher () {
    onClear(() => {
      if (this.watcher && !this.watcher.updating) {
        this.destructor()
      }
    })
    if (!this.watcher) {
      unwatch(() => {
        let watcher
        watcher = this.watcher = new Watch(update => {
          if (!watcher || watcher === this.watcher) {
            if (!update || this.state.watchers.size || this.state.caches.size) {
              this.state.value = this.target()
            } else {
              this.destructor()
            }
          }
        })
      })
    }
  }

  get value (): T {
    if (scope.activeWatcher) {
      this.checkWatcher()
      return this.state.value
    } else {
      return this.target()
    }
  }
}

export default Mixer

export {
  Mixer,
}
