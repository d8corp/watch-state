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
  update (): this {
    this.clear(this.cleaners, this.rendered)
    onClear(() => this.destructor())
    const prevWatcher = scope.activeWatcher
    scope.activeWatcher = this
    this.target(this.rendered)
    scope.activeWatcher = prevWatcher
    this.rendered = true
    return this
  }
  destructor (): this {
    this.clear(this.destructors, false)
    return this
  }
  private clear (callbacks: WatchTarget[], update: boolean): this {
    if (callbacks) {
      for (let i = 0; i < callbacks.length; i++) {
        callbacks[i](update)
      }
    }
    this.cleaners = undefined
    this.destructors = undefined
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

function unwatch (target: () => any) {
  const prevWatcher = scope.activeWatcher
  scope.activeWatcher = undefined
  const result = target()
  scope.activeWatcher = prevWatcher
  return result
}

export default Watch

export {
  Watch,
  onDestructor,
  onUpdate,
  onClear,
  watch,
  unwatch,
}

export * from './Scope'
