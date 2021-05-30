let activeWatcher: Watch

export interface Watcher <R = any> {
  (update?: boolean): R
}
export interface Destructor <R = any> {
  (): R
}

export class Watch {
  static get activeWatcher () {
    return activeWatcher
  }
  destructors: Destructor[]
  private ran: boolean = false

  constructor (private readonly watcher: Watcher, freeParent?: boolean, freeUpdate?: boolean) {
    if (!freeParent && activeWatcher) {
      activeWatcher.onDestroy(() => this.destroy())
    }
    if (!freeUpdate) {
      this.update()
    }
  }

  protected run () {
    const {ran} = this
    this.ran = true
    return this.watcher(ran)
  }

  update () {
    this.destroy()
    const prevWatcher = activeWatcher
    activeWatcher = this
    this.run()
    activeWatcher = prevWatcher
    return
  }

  destroy () {
    const {destructors} = this

    if (destructors) {
      this.destructors = undefined
      destructors.forEach(e => e())
    }

    return
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
