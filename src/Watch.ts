import scope from './Scope'

interface WatchTarget {
  (update: boolean): any
}
interface DestructorOrCleaner {
  (): any
}

class Watch {
  private destructors: DestructorOrCleaner[]
  private cleaners: DestructorOrCleaner[]
  rendered: true
  constructor (public target: WatchTarget) {
    this.update()
  }
  update (): void {
    this.clear()
    onClear(() => this.destructor())
    const prevWatcher = scope.activeWatcher
    scope.activeWatcher = this
    this.target(this.rendered)
    scope.activeWatcher = prevWatcher
    this.rendered = true
  }
  destructor () {
    const {destructors} = this
    if (destructors) {
      for (let i = 0; i < destructors.length; i++) {
        destructors[i]()
      }
      this.destructors = undefined
    }
  }
  private clear () {
    const {cleaners} = this
    if (cleaners) {
      for (let i = 0; i < cleaners.length; i++) {
        cleaners[i]()
      }
      this.cleaners = undefined
    }
  }
  onDestructor (callback: DestructorOrCleaner) {
    if (this.destructors) {
      this.destructors.push(callback)
    } else {
      this.destructors = [callback]
    }
  }
  onUpdate (callback: DestructorOrCleaner) {
    if (this.cleaners) {
      this.cleaners.push(callback)
    } else {
      this.cleaners = [callback]
    }
  }
  onClear (callback: DestructorOrCleaner) {
    this.onUpdate(callback)
    this.onDestructor(callback)
  }
}

function watch (target: WatchTarget): Watch {
  return new Watch(target)
}

function onDestructor (callback: DestructorOrCleaner): boolean {
  if (scope.activeWatcher) {
    scope.activeWatcher.onDestructor(callback)
    return true
  }
  return false
}

function onUpdate (callback: DestructorOrCleaner): boolean {
  if (scope.activeWatcher) {
    scope.activeWatcher.onUpdate(callback)
    return true
  }
  return false
}

function onClear (callback: DestructorOrCleaner): boolean {
  if (scope.activeWatcher) {
    scope.activeWatcher.onClear(callback)
    return true
  }
  return false
}

function lock (target) {
  const prevWatcher = scope.activeWatcher
  scope.activeWatcher = undefined
  const result = target()
  scope.activeWatcher = prevWatcher
  return result
}

export default watch

export {
  Watch,
  onDestructor,
  onUpdate,
  onClear,
  lock,
  watch,
}
