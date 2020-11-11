'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils_scope_scope = require('../scope/scope.js');

function onDestructor(callback) {
    if (utils_scope_scope['default'].activeWatcher) {
        utils_scope_scope['default'].activeWatcher.onDestructor(callback);
        return true;
    }
    return false;
}

exports.default = onDestructor;
exports.onDestructor = onDestructor;
