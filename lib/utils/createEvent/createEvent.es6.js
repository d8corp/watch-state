import { globalEvent } from '../../Event/Event.es6.js';

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
        globalEvent.start();
        const result = fn.apply(this, arguments);
        globalEvent.end();
        return result;
    };
}

export { createEvent };
