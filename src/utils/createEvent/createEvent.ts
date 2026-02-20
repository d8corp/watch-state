import { unwatch } from '../unwatch'

import { forceQueueWatchers } from '../../Compute'
import { scope } from '../../constants'

/**
 * **Creates reactive event function** (unlike `event` which executes immediately).
 *
 * Like `event`, `createEvent`:
 * - **Ignores** automatic state subscriptions (`unwatch`)
 * - **Batches** state updates and **flushes queue** at the end
 * - Perfect for **event handlers** and **mutations**
 * - **Returns function** for later execution (unlike `event`)
 *
 * @example Basic usage
 * ```ts
 * const count = new State(0)
 *
 * const increase = createEvent(() => {
 *   console.log(count.value++)
 * })
 *
 * new Watch(() => console.log(count.value))
 * // logs: 0
 *
 * increase() // logs: 1 (executes now)
 * ```
 *
 * @example Batch multiple updates (single watcher notification)
 * ```ts
 * const a = new State(0)
 * const b = new State(0)
 *
 * const increase = createEvent(() => {
 *   a.value++
 *   b.value++
 * })
 *
 * new Watch(() => console.log(a.value, b.value))
 * // logs: 0, 0
 *
 * reset() // logs: 0, 0 (BOTH updated, ONE notification!)
 * ```
 *
 * @example Returns value from callback
 * ```ts
 * const count = new State(0)
 *
 * const increase = createEvent(() => count.value++)
 *
 * new Watch(() => console.log(count.value))
 * // logs: 0
 *
 * const prev = increase()
 * // logs: 1
 *
 * console.log(prev)
 * // logs: 0
 * ```
 *
 * @param callback - Effect callback to wrap in event
 * @returns Reusable event function with same signature as `callback`
 * @template F - callback function type
 */
export function createEvent<F extends (...args: any[]) => any> (callback: F): F {
  return function (...args: any[]) {
    const result = unwatch(() => {
      scope.eventDeep++
      // @ts-expect-error this
      const result = callback.apply(this, args)
      scope.eventDeep--

      return result
    })

    if (!scope.eventDeep) {
      forceQueueWatchers()
    }

    return result
  } as unknown as F
}
