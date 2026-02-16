'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var constants = require('../../constants.js');

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
    const { activeWatcher } = constants.scope;
    constants.scope.activeWatcher = undefined;
    const result = fn();
    constants.scope.activeWatcher = activeWatcher;
    return result;
}

exports.unwatch = unwatch;
