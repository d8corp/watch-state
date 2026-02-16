import { scope } from '../../constants.es6.js';

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
function unwatch(fn) {
    const { activeWatcher } = scope;
    scope.activeWatcher = undefined;
    const result = fn();
    scope.activeWatcher = activeWatcher;
    return result;
}

export { unwatch };
