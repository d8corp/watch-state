import scope from '../../utils/scope'
import onClear from '../../utils/onClear'
import Watch from '../Watch'

export class State <T = any> {
  private _watchers: Set<Watch>
  private target: T
  constructor(value?: T) {
    this.target = value
  }
  get value (): T {
    const {activeWatcher} = scope
    const {watchers} = this
    if (activeWatcher && !watchers.has(activeWatcher)) {
      watchers.add(activeWatcher)
      onClear(update => {
        if (!update || watchers === this.watchers) {
          watchers.delete(activeWatcher)
        }
      })
    }
    return this.target
  }
  set value (value: T) {
    if (value !== this.target) {
      this.target = value
      this.update()
    }
  }
  update () {
    const {watchers} = this
    if (watchers.size) {
      this._watchers = undefined
      if (scope.activeWatchers) {
        watchers.forEach(watcher => scope.activeWatchers.add(watcher))
      } else {
        watchers.forEach(watcher => watcher.update())
      }
    }
  }
  get watchers (): Set<Watch> {
    return this._watchers || (this._watchers = new Set())
  }
}

export default State
