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
  }

  end () {
    if (scope.activeEvent === this) {
      scope.activeEvent = undefined
      this.update()
      scope.activeWatcher = this.activeWatcher
    }
  }

  update () {
    if (this.watchers?.size) {
      const {activeWatchers} = this
      this.activeWatchers = this.watchers
      this.watchers = activeWatchers
      for (const watcher of this.activeWatchers) {
        watcher.update()
      }
    }
  }
}

export default Event
