import { Watch } from '../Watch'
import { State } from '../State'
import { Watcher } from '../types'

/**
 * You can cache computed state.
 * The watcher will not be triggered while new result is the same.
 * ```javascript
 * const name = new State('Foo')
 * const surname = new State('Bar')
 *
 * const fullName = new Cache(() => (
 *   `${name.value} ${surname.value[0]}`
 * ))
 *
 * new Watch(() => {
 *   console.log(fullName.value)
 * })
 * // console.log('Foo B')
 *
 * surname.value = 'Baz'
 * // nothing happens
 *
 * surname.value = 'Quux'
 * // console.log('Foo Q')
 * ```
 * */
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
    if (this.updated && this.size) {
      for (const watcher of this._state.watchers) {
        if (!(watcher instanceof Cache) || watcher.hasWatcher) {
          return true
        }
      }
    }
  }

  get size () {
    return this._state?.watchers?.size
  }

  deepUpdate () {
    this.updated = false
    this.destroy()
    if (this.size) {
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
