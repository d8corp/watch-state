import scope from '../scope'

export interface Watcher <R = any> {
  (update?: boolean): R
}
export interface Destructor <R = any> {
  (): R
}

export class Watch {
  destructors: Destructor[]
  private ran: boolean = false

  constructor (private readonly watcher: Watcher, freeParent?: boolean, freeUpdate?: boolean) {
    if (!freeParent && scope.activeWatcher) {
      scope.activeWatcher.onDestroy(() => this.destroy())
    }
    if (!freeUpdate) {
      this.watchRun()
    }
  }

  protected run () {
    const {ran} = this
    this.ran = true
    return this.watcher(ran)
  }

  protected watchRun () {
    const prevWatcher = scope.activeWatcher
    scope.activeWatcher = this
    this.run()
    scope.activeWatcher = prevWatcher
  }
  protected forceUpdate () {
    this.destroy()
    this.watchRun()
  }

  update () {
    if (scope.activeEvent) {
      scope.activeEvent.add(this)
    } else {
      this.forceUpdate()
    }
  }

  destroy () {
    const {destructors} = this

    if (destructors) {
      this.destructors = undefined
      destructors.forEach(e => e())
    }
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
