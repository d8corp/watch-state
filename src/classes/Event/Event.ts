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

  add (target: Watch | Cache) {
    if (this.watchers) {
      if (this.watchers.has(target)) {
        return
      }
      this.watchers.add(target)
    } else {
      this.watchers = new Set([target])
    }

    target.onDestroy(() => this.watchers.delete(target))
  }

  active () {
    activeEvent = this
  }

  deactivate () {
    if (activeEvent === this) {
      activeEvent = undefined
    }
  }

  run () {
    if (!this.watchers?.size) {
      return
    }

    if (activeEvent) {
      if (activeEvent !== this) {
        for (const target of this.watchers) {
          activeEvent.add(target)
        }
      }
    } else {
      this.watchers.add(undefined)

      for (const watcher of this.watchers) {
        if (!watcher) {
          break
        }

        if (watcher instanceof Cache) {
          watcher.clear()
        }
      }

      for (const watcher of this.watchers) {
        if (!watcher) {
          this.watchers.delete(undefined)
          break
        }

        watcher.update()
      }

      activeEvent = undefined
    }
  }
}

export default Event
