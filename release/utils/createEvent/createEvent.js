'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var constants = require('../../constants.js');
require('../../helpers/index.js');
require('../unwatch/index.js');
var unwatch = require('../unwatch/unwatch.js');
var queueWatchers = require('../../helpers/queueWatchers/queueWatchers.js');

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
        const result = unwatch.unwatch(() => {
            constants.scope.eventDeep++;
            const result = fn.apply(this, arguments);
            constants.scope.eventDeep--;
            return result;
        });
        if (!constants.scope.eventDeep) {
            queueWatchers.forceQueueWatchers();
        }
        return result;
    };
}

exports.createEvent = createEvent;
