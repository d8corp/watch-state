import State from '/classes/State'
import Watch, {Watcher} from '/classes/Watch'

export class Cache <V = any> extends Watch {
  private updated: boolean
  private _state: State<V>

  constructor (watcher: Watcher, freeParent?: boolean, fireImmediately?: boolean) {
    super(watcher, freeParent, !fireImmediately)
  }

  destroy (): this {
    this.updated = false
    return super.destroy()
  }

  clear () {
    this.destroy()
    this._state?.update()
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
