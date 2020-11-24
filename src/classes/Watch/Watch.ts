import scope from '../../utils/scope'
import onClear from '../../utils/onClear'

interface WatchTarget {
  (update?: boolean): any
}

class Watch {
  private destructors: WatchTarget[]
  private cleaners: WatchTarget[]
  private rendered: boolean = false
  public updating: boolean = false
  constructor (private readonly target: WatchTarget) {
    this.update()
  }
  update (): this {
    this.updating = true
    this.clear(this.cleaners, this.rendered)
    onClear(() => this.destructor())
    const prevWatcher = scope.activeWatcher
    scope.activeWatcher = this
    this.target(this.rendered)
    scope.activeWatcher = prevWatcher
    this.rendered = true
    this.updating = false
    return this
  }
  destructor (): this {
    this.clear(this.destructors, false)
    return this
  }
  private clear (callbacks: WatchTarget[], update: boolean): this {
    this.cleaners = undefined
    this.destructors = undefined
    if (callbacks) {
      for (let i = 0; i < callbacks.length; i++) {
        callbacks[i](update)
      }
    }
    return this
  }
  onDestructor (callback: WatchTarget): this {
    if (this.destructors) {
      this.destructors.push(callback)
    } else {
      this.destructors = [callback]
    }
    return this
  }
  onUpdate (callback: WatchTarget): this {
    if (this.cleaners) {
      this.cleaners.push(callback)
    } else {
      this.cleaners = [callback]
    }
    return this
  }
  onClear (callback: WatchTarget): this {
    this.onUpdate(callback)
    this.onDestructor(callback)
    return this
  }
}

export default Watch

export {
  Watch,
  WatchTarget,
}
