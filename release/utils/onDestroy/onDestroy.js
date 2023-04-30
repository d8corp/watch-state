'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var constants = require('../../constants.js');

/**
 * You can subscribe on destroy or update of watcher
 * ```javascript
 * const count = new State(0)
 * const watcher = new Watch(() => {
 *   console.log('count', count.value)
 *   // the order does not matter
 *   onDestroy(() => console.log('destructor'))
 * })
 * // console.log('count', 0)
 *
 * count.value++
 * // console.log('destructor')
 * // console.log('count', 1)
 *
 * watcher.destroy()
 * // console.log('destructor')
 *
 * watcher.destroy()
 * count.value++
 * // nothing happens
 * ```
 * */
function onDestroy(destructor) {
    if (constants.scope.activeWatcher) {
        constants.scope.activeWatcher.destructors.add(destructor);
    }
}

exports.onDestroy = onDestroy;
