/**
 * **Immediately executes** a reactive effect **outside of reactive tracking**.
 *
 * - **Runs callback immediately** (unlike `createEvent`)
 * - **Ignores** automatic state subscriptions (like `unwatch`)
 * - **Batches** state updates and **flushes queue** at the end
 * - Perfect for **side effects** and **mutations**
 *
 * @example Batch multiple updates
 * ```ts
 * const a = new State(0)
 * const b = new State(0)
 *
 * new Watch(() => {
 *   console.log(a.value, b.value)
 * })
 * // logs: 0, 0
 *
 * a.value = 1
 * // logs: 1, 0
 *
 * b.value = 1
 * // logs: 1, 1
 *
 * callEvent(() => {
 *   a.value = 2
 *   b.value = 2
 * })
 * // logs: 1, 1
 * ```
 *
 * @example Returns value from callback
 * ```ts
 * const count = new State(0)
 *
 * new Watch(() => console.log(count.value))
 * // logs: 0
 *
 * const prev = callEvent(() => count.value++)
 * // logs: 1
 *
 * console.log(prev)
 * // logs: 0
 * ```
 *
 * @param callback - Effect callback to execute immediately
 * @returns Result of callback execution
 * @template T - return type
 */
export declare function callEvent<T>(callback: () => T): T;
