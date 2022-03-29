'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var constants = require('../../constants.js');

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
        constants.globalEvent.start();
        const result = fn.apply(this, arguments);
        constants.globalEvent.end();
        return result;
    };
}

exports.createEvent = createEvent;
