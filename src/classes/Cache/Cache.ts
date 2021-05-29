import {CacheState} from 'src/classes/State'
import Watch, {Watcher} from 'src/classes/Watch'

export class Cache <V = any> extends Watch {
  private updated: boolean
  private _state: CacheState<V>

  constructor (watcher: Watcher, freeParent?: boolean, fireImmediately?: boolean) {
    super(watcher, freeParent, !fireImmediately)
  }

  destroy (): this {
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

  private get state (): CacheState<V> {
    if (!this._state) {
      this._state = new CacheState()
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
