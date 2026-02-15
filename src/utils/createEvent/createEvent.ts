import { unwatch } from '../unwatch'

import { forceQueueWatchers } from '../../Compute'
import { scope } from '../../constants'

/**
 * You can create event function with createEvent
 * ```ts
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
  return function (...args: any[]) {
    const result = unwatch(() => {
      scope.eventDeep++
      const result = fn.apply(this, args)
      scope.eventDeep--

      return result
    })

    if (!scope.eventDeep) {
      forceQueueWatchers()
    }

    return result
  } as unknown as F
}
