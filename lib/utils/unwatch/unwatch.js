'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils_scope_scope = require('../scope/scope.js');

function unwatch(target) {
    var prevWatcher = utils_scope_scope['default'].activeWatcher;
    utils_scope_scope['default'].activeWatcher = undefined;
    var result = target();
    utils_scope_scope['default'].activeWatcher = prevWatcher;
    return result;
}

exports.default = unwatch;
exports.unwatch = unwatch;
