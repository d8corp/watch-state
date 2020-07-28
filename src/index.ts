type WatchTarget = (first: boolean) => any

interface Destructor {
  (): any
}

let activeWatcher: Watch
let activeWatchers: Set<Watch>

const STATE_VALUES = Symbol('state values')

class Watch {
  private _destructors: Set<Destructor>
  private _children: Set<Watch>
  constructor (public target: WatchTarget) {
    this.render(true)
  }
  render (first: boolean): void {
    if (!first) {
      this.clear()
    }
    if (activeWatcher) {
      activeWatcher.children.add(this)
    }
    const prevWatcher = activeWatcher
    activeWatcher = this
    this.target(first)
    activeWatcher = prevWatcher
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
class State <T = any> {
  watchers: Set<Watch> = new Set()
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
            watcher.render(false)
          }
        }
      }
    }
  }
}
class Computed <T = any> {
  state = new State<T>()
  constructor (public target: () => T) {
    new Watch(() => this.state.value = target())
  }
  get value (): T {
    return this.state.value
  }
}

function watch (target: WatchTarget): Watch {
  return new Watch(target)
}
function lock (target) {
  const prevWatcher = activeWatcher
  activeWatcher = undefined
  const result = target()
  activeWatcher = prevWatcher
  return result
}

// decorators
function state (target: Object, propertyKey: PropertyKey): void
function state (target, propertyKey) {
  Object.defineProperty(target, propertyKey, {
    get (): any {
      const values = getCache(this)
      if (!(propertyKey in values)) {
        values[propertyKey] = new State()
      }
      return values[propertyKey].value
    },
    set (v: any): void {
      const values = getCache(this)
      if (!(propertyKey in values)) {
        values[propertyKey] = new State(v)
      } else {
        values[propertyKey].value = v
      }
    },
    enumerable: true
  })
}

function computed (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any>
function computed (target, propertyKey, descriptor) {
  const {get} = descriptor
  return {
    ...descriptor,
    get () {
      const values = getCache(this)
      if (!(propertyKey in values)) {
        lock(() => values[propertyKey] = new Computed(get.bind(this)))
      }
      return values[propertyKey].value
    }
  }
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
          watcher.render(false)
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

function getCache (target) {
  if (!(STATE_VALUES in target)) {
    target[STATE_VALUES] = {}
  }
  return target[STATE_VALUES]
}

export default watch

export {
  State,
  Watch,
  Computed,
  Destructor,
  watch,
  reset,
  computed,
  action,
  lock,
  destructor,
  state
}
