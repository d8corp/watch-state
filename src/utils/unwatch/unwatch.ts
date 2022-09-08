import { scope } from '../../constants'

/**
 * You can stop watching a piece of code
 * ```typescript
 * import { State, Watch, unwatch } from '../..'
 *
 * const count = new State(0)
 *
 * new Watch(() => {
 *   console.log(unwatch(() => count.value++))
 * })
 *
 * count.value++
 * ```
 * */
export function unwatch<T> (fn: () => T): T {
  const { activeWatcher } = scope
  scope.activeWatcher = undefined
  const result = fn()
  scope.activeWatcher = activeWatcher
  return result
}
