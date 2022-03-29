import { scope } from '../constants'
import { Destructor, Watcher } from '../types'

import { onDestroy } from '../utils'

export class Watch {
  destructors: Destructor[]
  private ran: boolean = false

  constructor (private readonly watcher: Watcher, freeParent?: boolean, freeUpdate?: boolean) {
    if (!freeParent) {
      onDestroy(() => this.destroy())
    }
    if (!freeUpdate) {
      this.watchRun()
    }
  }

  protected run () {
    const { ran } = this
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

  /**
   * You can run a watcher even when it's states are not updated.
   * ```typescript
   * const count = new State(0)
   *
   * const watcher = new Watch(() => {
   *   console.log(count.value)
   * })
   * // console.log(0)
   *
   * watcher.update()
   * // console.log(0)
   * ```
   * */
  update () {
    this.destroy()
    if (scope.activeEvent) {
      scope.activeEvent.add(this)
    } else {
      this.watchRun()
    }
  }

  /**
   * You can stop watching by `destroy` method of `Watch`.
   * ```javascript
   * const count = new State(0)
   *
   * const watcher = new Watch(() => {
   *   console.log(count.value)
   * })
   * // console.log(0)
   *
   * count.value++
   * // console.log(1)
   *
   * watcher.destroy()
   *
   * count.value++
   * // nothing happens
   * ```
   * */
  destroy () {
    const { destructors } = this

    if (destructors) {
      this.destructors = undefined
      destructors.forEach(e => e())
    }
  }

  onClear (callback: Destructor): this {
    if (this.destructors) {
      this.destructors.push(callback)
    } else {
      this.destructors = [callback]
    }
    return this
  }

  /** @deprecated use onClear */
  onDestroy (callback: Destructor): this {
    return this.onClear(callback)
  }
}
