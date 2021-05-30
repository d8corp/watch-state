import Watch from 'src/Watch'
import Cache from 'src/Cache'

let activeEvent: Event

export class Event {
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

    target.onDestroy(() => watchers.delete(target))
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
      watcher.onDestroy(() => this.activeWatchers.delete(watcher))
    } else {
      this.activeWatchers = new Set([watcher])
    }
  }

  update () {
    if (!this.watchers?.size) {
      return
    }

    if (activeEvent) {
      for (const target of this.watchers) {
        activeEvent.pipe(target)
      }
    } else {
      this.start()
      this.end()
    }
  }
}

export default Event
