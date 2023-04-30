import { scope } from '../../constants.es6.js';
import '../../helpers/index.es6.js';
import '../unwatch/index.es6.js';
import { unwatch } from '../unwatch/unwatch.es6.js';
import { forceQueueWatchers } from '../../helpers/queueWatchers/queueWatchers.es6.js';

/**
 * You can create event function with createEvent
 * ```typescript
 * import { State, createEvent } from 'watch-state'
 *
 * const count = new State(0)
 * const increase = createEvent(() => {
 *   console.log(count.value++)
 * })
 *
 * new Watch(increase)
 * ```
 * */
function createEvent(fn) {
    return function () {
        const result = unwatch(() => {
            scope.eventDeep++;
            const result = fn.apply(this, arguments);
            scope.eventDeep--;
            return result;
        });
        if (!scope.eventDeep) {
            forceQueueWatchers();
        }
        return result;
    };
}

export { createEvent };
