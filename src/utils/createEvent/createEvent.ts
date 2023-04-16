import { unwatch } from '../unwatch'

import { scope } from '../../constants'
import { forceQueueWatchers } from '../../helpers'

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
    const result = unwatch(() => {
      scope.eventDeep++
      const result = fn.apply(this, arguments)
      scope.eventDeep--
      return result
    })

    if (!scope.eventDeep) {
      forceQueueWatchers()
    }

    return result
  } as unknown as F
}
