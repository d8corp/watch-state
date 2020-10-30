import stateValues from './stateValues'

// Watch
let activeWatcher: Watch

interface WatchTarget {
  (update: boolean): any
}
interface Destructor {
  (): any
}

class Watch {
  private _destructors: Set<Destructor>
  private _children: Set<Watch>
  rendered: true
  constructor (public target: WatchTarget) {
    this.render()
  }
  render (): void {
    const {rendered = false} = this
    if (rendered) {
      this.clear()
    }
    if (activeWatcher) {
      activeWatcher.children.add(this)
    }
    const prevWatcher = activeWatcher
    activeWatcher = this
    this.target(rendered)
    activeWatcher = prevWatcher
    this.rendered = true
  }
  destructor () {
    this.clear()
    if (this._destructors) {
      for (const destructor of this._destructors) {
        destructor()
      }
      this._destructors = undefined
    }
  }
  clear () {
    if (this._children) {
      for (const watcher of this._children) {
        watcher.destructor()
      }
      this._children = undefined
    }
  }
  get destructors (): Set<Destructor> {
    return this._destructors || (this._destructors = new Set())
  }
  get children (): Set<Watch> {
    return this._children || (this._children = new Set())
  }
}

function watch (target: WatchTarget): Watch {
  return new Watch(target)
}

// State
let activeWatchers: Set<Watch>

class State <T = any> {
  private watchers: Set<Watch> = new Set()
  constructor(public target?: T) {}
  get value (): T {
    const currentWatcher = activeWatcher
    if (currentWatcher && !this.watchers.has(currentWatcher)) {
      this.watchers.add(currentWatcher)
      new Watch(() => destructor(() => this.watchers.delete(currentWatcher)))
    }
    return this.target
  }
  set value (value: T) {
    if (value !== this.target) {
      this.target = value
      const {watchers} = this
      if (watchers.size) {
        this.watchers = new Set()
        if (activeWatchers) {
          for (const watcher of watchers) {
            activeWatchers.add(watcher)
          }
        } else {
          for (const watcher of watchers) {
            watcher.render()
          }
        }
      }
    }
  }
}

function lock (target) {
  const prevWatcher = activeWatcher
  activeWatcher = undefined
  const result = target()
  activeWatcher = prevWatcher
  return result
}

// decorators
interface StateValues {
  [key: string]: State
}

function state (target: Object, propertyKey: PropertyKey): void
function state (target, propertyKey) {
  Object.defineProperty(target, propertyKey, {
    get (): any {
      const values = stateValues(this)
      if (!(propertyKey in values)) {
        values[propertyKey] = new State()
      }
      return values[propertyKey].value
    },
    set (v: any): void {
      const values: StateValues = stateValues(this) as StateValues
      if (!(propertyKey in values)) {
        values[propertyKey] = new State(v)
      } else {
        values[propertyKey].value = v
      }
    },
    enumerable: true
  })
}

function action <T> (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void
function action <T> (callback: T): T
function action (target, propertyKey?, descriptor?) {
  if (typeof target === 'function') {
    return function () {
      if (activeWatchers) {
        return target.apply(this, arguments)
      } else {
        const watchers = activeWatchers = new Set()
        const result = target.apply(this, arguments)
        activeWatchers = undefined
        for (const watcher of watchers) {
          watcher.render()
        }
        return result
      }
    }
  } else {
    return {
      ...descriptor,
      value: action(descriptor.value)
    }
  }
}

function destructor (destructor: Destructor): boolean {
  if (activeWatcher) {
    activeWatcher.destructors.add(destructor)
    return true
  }
  return false
}

function reset () {
  activeWatchers = activeWatcher = undefined
}

export default watch

export {
  State,
  Watch,
  Destructor,
  watch,
  reset,
  action,
  lock,
  destructor,
  state
}
