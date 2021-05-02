import scope from '../../utils/scope'
import Watch from '../Watch'

export class State <T = any> {
  public watchers: Set<Watch>

  constructor (public state?: T) {}

  /**
   * the field returns current state.
   * ```typescript
   * const state = new State(1)
   * console.log(state.value) // 1
   * ```
   * */
  get value (): T {
    const {activeWatcher} = scope

    if (activeWatcher) {
      if (!this.watchers) {
        this.watchers = new Set([activeWatcher])
        activeWatcher.onDestroy(() => {
          this.watchers.delete(activeWatcher)
        })
      } else if (!this.watchers.has(activeWatcher)) {
        this.watchers.add(activeWatcher)
        activeWatcher.onDestroy(() => {
          this.watchers.delete(activeWatcher)
        })
      }
    }
    return this.state
  }

  /**
   * Change the state.
   * ```typescript
   * const state = new State(1)
   * console.log(state.value) // 1
   *
   * state.value = 2
   * console.log(state.value) // 2
   * ```
   * */
  set value (value: T) {
    if (value !== this.state) {
      this.state = value
      this.$update()
    }
  }

  private $update () {
    if (this.watchers?.size) {
      const {activeWatcher} = scope
      let {eventWatchers} = scope

      scope.activeWatcher = undefined

      this.watchers.add(undefined)

      for (const watcher of this.watchers) {
        if (!watcher) {
          break
        }
        if (watcher.watchers?.size) {
          watcher.update()
        } else if (eventWatchers) {
          eventWatchers.add(watcher)
        }
      }

      if (eventWatchers) {
        this.watchers.delete(undefined)
      } else {
        for (const watcher of this.watchers) {
          if (!watcher) {
            this.watchers.delete(undefined)
            break
          }

          watcher.update()
        }
      }

      scope.activeWatcher = activeWatcher
    }
  }
  /**
   * Update all watchers of the state.
   * ```typescript
   * const state = new State(1)
   * new Watch(() => console.log(state.value))
   * // 1
   * state.update()
   * // 1
   * ```
   * */
  update () {
    this.$update()
  }
}

export default State
