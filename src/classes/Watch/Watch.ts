import scope from '../../utils/scope'
import onDestroy from '../../utils/onDestroy'
import State from '../State'

export interface Watcher <R = any> {
  (update?: boolean): R
}
export interface Destructor <R = any> {
  (): R
}

export class Watch <V = any> extends State <V> {
  private destructors: Destructor[]

  constructor (private readonly watcher: Watcher, freeParent?: boolean) {
    super()
    if (!freeParent) {
      onDestroy(() => {
        this.destroy()
      })
    }
    this.update(false)
  }

  update (destroy = true): this {
    if (destroy) {
      this.destroy()
    }
    const prevWatcher = scope.activeWatcher
    scope.activeWatcher = this
    this.value = this.watcher(destroy)
    scope.activeWatcher = prevWatcher
    return this
  }

  destroy (): this {
    const {destructors} = this

    if (destructors) {
      this.destructors = undefined
      destructors.forEach(e => e())
    }
    return this
  }

  onDestroy (callback: Destructor): this {
    if (this.destructors) {
      this.destructors.push(callback)
    } else {
      this.destructors = [callback]
    }
    return this
  }
}

export default Watch
