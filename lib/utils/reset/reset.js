'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils_scope_scope = require('../scope/scope.js');

function reset() {
    utils_scope_scope['default'].activeWatchers = utils_scope_scope['default'].activeWatcher = undefined;
}

exports.default = reset;
exports.reset = reset;
