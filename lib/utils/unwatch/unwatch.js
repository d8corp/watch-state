'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var constants = require('../../constants.js');

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
function unwatch(fn) {
    const { activeWatcher } = constants.scope;
    constants.scope.activeWatcher = undefined;
    const result = fn();
    constants.scope.activeWatcher = activeWatcher;
    return result;
}

exports.unwatch = unwatch;
