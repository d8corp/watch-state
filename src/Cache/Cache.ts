import {Watch, Watcher} from '../Watch'
import {State} from '../State'

export class Cache <V = any> extends Watch {
  protected updated: boolean
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
    if (this.updated && this._state?.watchers?.size) {
      for (const watcher of this._state.watchers) {
        if (!(watcher instanceof Cache) || watcher.hasWatcher) {
          return true
        }
      }
    }
  }

  deepUpdate () {
    this.updated = false
    this.destroy()
    if (this._state?.watchers?.size) {
      for (const watcher of this._state.watchers) {
        (watcher as Cache).deepUpdate()
      }
    }
  }

  update () {
    if (this.updated) {
      if (this.hasWatcher) {
        this.forceUpdate()
      } else {
        this.deepUpdate()
      }
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
