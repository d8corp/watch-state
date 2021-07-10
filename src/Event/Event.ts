import Watch from '../Watch'
import Cache from '../Cache'
import scope from '../scope'

export class Event {
  watchers: Set<Watch | Cache>
  activeWatchers: Set<Watch | Cache>
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

    target.onDestroy(() => watchers.delete(target))
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
    const {activeWatchers} = this
    this.activeWatchers = this.watchers
    this.watchers = activeWatchers
    for (const watcher of this.activeWatchers) {
      watcher.update()
    }
  }

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

export const globalEvent = new Event()

export default Event
