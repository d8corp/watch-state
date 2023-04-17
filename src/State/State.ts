import { queueWatchers } from '../helpers'
import { Observable } from '../Observable'

export class State<V = unknown> extends Observable<V> {
  constructor (value?: V) {
    super()
    this.rawValue = value
  }

  get value () {
    return super.value
  }

  set value (value: V) {
    if (this.rawValue !== value) {
      this.rawValue = value
      this.update()
    }
  }

  update () {
    queueWatchers(this.observers)
  }
}
