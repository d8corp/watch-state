import scope from './Scope'

interface WatchTarget {
  (update: boolean): any
}

class Watch {
  private destructors: WatchTarget[]
  private cleaners: WatchTarget[]
  private rendered: boolean = false
  constructor (public target: WatchTarget) {
    this.update()
  }
  update (): void {
    this.clear(this.cleaners, this.rendered)
    onClear(() => this.destructor())
    const prevWatcher = scope.activeWatcher
    scope.activeWatcher = this
    this.target(this.rendered)
    scope.activeWatcher = prevWatcher
    this.rendered = true
  }
  destructor () {
    this.clear(this.destructors, false)
  }
  private clear (callbacks: WatchTarget[], update: boolean) {
    if (callbacks) {
      for (let i = 0; i < callbacks.length; i++) {
        callbacks[i](update)
      }
    }
    this.cleaners = undefined
    this.destructors = undefined
  }
  onDestructor (callback: WatchTarget) {
    if (this.destructors) {
      this.destructors.push(callback)
    } else {
      this.destructors = [callback]
    }
  }
  onUpdate (callback: WatchTarget) {
    if (this.cleaners) {
      this.cleaners.push(callback)
    } else {
      this.cleaners = [callback]
    }
  }
  onClear (callback: WatchTarget) {
    this.onUpdate(callback)
    this.onDestructor(callback)
  }
}

function watch (target: WatchTarget): Watch {
  return new Watch(target)
}

function onDestructor (callback: WatchTarget): boolean {
  if (scope.activeWatcher) {
    scope.activeWatcher.onDestructor(callback)
    return true
  }
  return false
}

function onUpdate (callback: WatchTarget): boolean {
  if (scope.activeWatcher) {
    scope.activeWatcher.onUpdate(callback)
    return true
  }
  return false
}

function onClear (callback: WatchTarget): boolean {
  if (scope.activeWatcher) {
    scope.activeWatcher.onClear(callback)
    return true
  }
  return false
}

export default Watch

export {
  Watch,
  onDestructor,
  onUpdate,
  onClear,
  watch,
}

export * from './Scope'
