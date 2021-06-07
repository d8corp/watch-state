import Watch, {Watcher} from '../Watch'
import State from '../State'

export class Cache <V = any> extends Watch {
  private updated: boolean
  private _state: State<V>

  constructor (watcher: Watcher, freeParent?: boolean, fireImmediately?: boolean) {
    super(watcher, freeParent, !fireImmediately)
  }

  destroy () {
    this.updated = false
    return super.destroy()
  }

  clear () {
    if (this._state?.watchers?.size) {
      this.update()
    } else {
      this.destroy()
    }
  }

  run () {
    this.value = super.run()
    this.updated = true
  }

  private get state (): State<V> {
    if (!this._state) {
      this._state = new State()
    }
    return this._state
  }

  get value () {
    if (!this.updated) {
      this.update()
    }
    return this.state.value
  }

  set value (value) {
    this.state.value = value
  }
}

export default Cache
