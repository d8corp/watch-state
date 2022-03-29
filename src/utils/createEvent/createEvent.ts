import { globalEvent } from '../../constants'

/**
 * You can create event function with createEvent
 * ```typescript
 * import { State, createEvent } from 'watch-state'
 *
 * const count = new State(0)
 * const increase = createEvent(() => {
 *   console.log(count.value++)
 * })
 *
 * new Watch(increase)
 * ```
 * */
export function createEvent<F extends Function> (fn: F): F {
  return function () {
    globalEvent.start()
    const result = fn.apply(this, arguments)
    globalEvent.end()
    return result
  } as unknown as F
}
