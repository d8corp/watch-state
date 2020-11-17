import unwatch from '../../utils/unwatch'
import onClear from '../../utils/onClear'
import Watch from '../Watch'
import State from '../State'
import scope from '../../utils/scope'

class Mixed <T = any> {
  public state: State<T> = new State<T>()
  public watcher: Watch
  private newValue?: T
  constructor (protected target: () => T) {}
  destructor () {
    this.watcher?.destructor()
    this.watcher = undefined
  }
  checkWatcher () {
    if (!this.watcher) {
      onClear(() => this.destructor())
      unwatch(() => {
        const watcher = this.watcher = new Watch(() => {
          if (watcher === this.watcher) {
            this.newValue = 'newValue' in this ? this.newValue : this.target()
            if (this.state.target !== this.newValue) {
              this.state.value = this.newValue
            }
            delete this.newValue
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


export default Mixed

export {
  Mixed,
}
