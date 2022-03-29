import { scope, globalEvent } from '../constants'

import { Watch } from '../Watch'
import { Cache } from '../Cache'

export class Event {
  watchers: Set<Watch | Cache>
  activeWatcher: Watch

  add (target: Watch | Cache) {
    let {watchers} = this
    if (watchers) {
      if (watchers.has(target)) {
        return
      }
      watchers.add(target)
    } else {
      watchers = this.watchers = new Set([target])
    }

    target.onClear(() => watchers.delete(target))
  }

  start () {
    if (!scope.activeEvent) {
      this.activeWatcher = scope.activeWatcher
      scope.activeWatcher = undefined
      scope.activeEvent = this
    }
    scope.activeEventDeep++
  }

  end () {
    if (!--scope.activeEventDeep && scope.activeEvent === this) {
      scope.activeEvent = undefined
      this.update()
      scope.activeWatcher = this.activeWatcher
    }
  }

  private forceUpdate () {
    const { watchers } = this
    this.watchers = undefined
    for (const watcher of watchers) {
      watcher.update()
    }
  }

  /**
   * You can run watchers of a state with `update` method.
   * ```typescript
   * const count = new State(0)
   *
   * new Watch(() => {
   *   console.log(count.value)
   * })
   * // console.log(0)
   *
   * count.update()
   * // console.log(0)
   * ```
   * */
  update () {
    if (this.watchers?.size) {
      if (this === globalEvent) {
        this.forceUpdate()
      } else {
        globalEvent.start()
        this.forceUpdate()
        globalEvent.end()
      }
    }
  }
}
