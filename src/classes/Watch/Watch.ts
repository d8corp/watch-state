import onDestroy from 'src/utils/onDestroy'

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
  static set activeWatcher (watcher: Watch) {
    activeWatcher = watcher
  }
  destructors: Destructor[]
  private ran: boolean = false
  updating: boolean // TODO: check if we need to use it

  constructor (private readonly watcher: Watcher, freeParent?: boolean, freeUpdate?: boolean) {
    if (!freeParent) {
      onDestroy(() => this.destroy())
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

  update (): this {
    if (this.updating) {
      return this
    }
    this.updating = true
    this.destroy()
    const prevWatcher = activeWatcher
    activeWatcher = this
    this.run()
    activeWatcher = prevWatcher
    this.updating = false
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
