import { scope } from '../../constants.es6.js';

/**
 * You can subscribe on destroy or update of watcher
 * ```ts
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
    if (scope.activeWatcher) {
        scope.activeWatcher.destructors.add(destructor);
    }
}

export { onDestroy };
