import Watch from 'src/Watch'
import Event from 'src/Event'

export class State <T = any> extends Event {
  constructor (public state?: T) {super()}

  /**
   * the field returns current state.
   * ```typescript
   * const state = new State(1)
   * console.log(state.value) // 1
   * ```
   * */
  get value (): T {
    const {activeWatcher} = Watch

    if (activeWatcher) {
      this.add(activeWatcher)
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
      this.update()
    }
  }
}

export default State
