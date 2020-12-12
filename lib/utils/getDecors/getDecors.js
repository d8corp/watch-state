'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var VALUES = Symbol('state values');
function getDecors(target) {
    if (!(VALUES in target)) {
        // @ts-ignore
        target[VALUES] = {};
    }
    return target[VALUES];
}

exports.default = getDecors;
exports.getDecors = getDecors;
