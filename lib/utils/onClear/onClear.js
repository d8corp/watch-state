'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils_scope_scope = require('../scope/scope.js');

function onClear(callback) {
    if (utils_scope_scope['default'].activeWatcher) {
        utils_scope_scope['default'].activeWatcher.onClear(callback);
        return true;
    }
    return false;
}

exports.default = onClear;
exports.onClear = onClear;
