import Watch, {Watcher} from '../Watch'
import State from '../State'

export class Cache <V = any> extends Watch {
  private updated: boolean
  private _state: State<V>

  constructor (watcher: Watcher, freeParent?: boolean, fireImmediately?: boolean) {
    super(watcher, freeParent, !fireImmediately)
  }

  destroy () {
    return super.destroy()
  }

  run () {
    this.updated = true
    this.value = super.run()
  }

  get hasWatcher (): boolean {
    if (this._state?.watchers?.size) {
      for (const watcher of this._state.watchers) {
        if (!(watcher instanceof Cache) || watcher.hasWatcher) {
          return true
        }
      }
    }
  }

  update () {
    if (this.hasWatcher) {
      this.forceUpdate()
    } else {
      this.updated = false
    }
  }

  private get state (): State<V> {
    return this._state || (this._state = new State())
  }

  get value () {
    if (!this.updated) {
      this.forceUpdate()
    }
    return this.state.value
  }

  set value (value) {
    this.state.value = value
  }
}

export default Cache
