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
export declare function unwatch<T>(fn: () => T): T;
