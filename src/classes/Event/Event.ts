import Watch from 'src/classes/Watch'
import Cache from 'src/classes/Cache'

let activeEvent: Event

class Event {
  static get activeEvent () {
    return activeEvent
  }
  static set activeEvent (event: Event) {
    activeEvent = event
  }

  watchers: Set<Watch | Cache>
  activeWatchers: Set<Watch | Cache>

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

    const watcherList = watchers

    target.onDestroy(() => watcherList.delete(target))
  }

  start () {
    if (!activeEvent) {
      activeEvent = this
      const {activeWatchers} = this
      this.activeWatchers = this.watchers
      this.watchers = activeWatchers
    }
  }

  end () {
    if (activeEvent === this) {
      for (const watcher of this.activeWatchers) {
        if (watcher instanceof Cache) {
          watcher.clear()
        }
      }

      for (const watcher of this.activeWatchers) {
        watcher.update()
      }

      activeEvent = undefined
    }
  }

  pipe (watcher: Watch | Cache) {
    if (this.activeWatchers) {
      this.activeWatchers.add(watcher)
    } else {
      this.activeWatchers = new Set([watcher])
    }
  }

  update () {
    if (!this.watchers?.size) {
      return
    }

    if (activeEvent) {
      if (activeEvent !== this) {
        for (const target of this.watchers) {
          activeEvent.pipe(target)
        }
      }
    } else {
      this.start()
      this.end()
    }
  }
}

export default Event