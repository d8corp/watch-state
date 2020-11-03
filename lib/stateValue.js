'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var VALUES = Symbol('state values');
function stateValues(target) {
    if (!(VALUES in target)) {
        target[VALUES] = {};
    }
    return target[VALUES];
}

exports.default = stateValues;
exports.stateValues = stateValues;
