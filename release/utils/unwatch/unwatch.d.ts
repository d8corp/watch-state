/**
 * **Disables automatic state subscriptions** by wrapping value access in `unwatch`.
 *
 * **Unlike `callEvent`/`createEvent`**, `unwatch` does **NOT batch updates**.
 *
 * ```ts
 * import { State, Watch, unwatch } from 'watch-state'
 *
 * const count = new State(0)
 *
 * new Watch(() => {
 *   console.log(unwatch(() => count.value++))
 * })                       // logs: 0
 *
 * count.value++            // logs: 1
 *
 * console.log(count.value) // logs: 2
 * ```
 * */
export declare function unwatch<T>(fn: () => T): T;
