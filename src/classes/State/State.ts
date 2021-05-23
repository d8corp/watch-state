import Event from 'src/classes/Event'
import Watch from 'src/classes/Watch'

export class State <T = any> extends Event {
  constructor (public state?: T) {
    super()
  }

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
      this.run()
    }
  }

  /**
   * Update all watchers of the state.
   * ```typescript
   * const state = new State(1)
   * new Watch(() => console.log('test'))
   * // 1
   * state.update()
   * // 1
   * ```
   * */
  update () {
    this.run()
  }
}

export default State
