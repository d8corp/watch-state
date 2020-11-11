'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('../../utils/scope/scope.js');
var utils_createEvent_createEvent = require('../../utils/createEvent/createEvent.js');

function event(target, propertyKey, descriptor) {
    return {
        value: utils_createEvent_createEvent['default'](descriptor.value),
        enumerable: true
    };
}

exports.default = event;
exports.event = event;
