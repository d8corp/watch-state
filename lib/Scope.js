'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var scope = {};
function reset() {
    scope.actionWatchers = scope.activeWatcher = undefined;
}

exports.default = scope;
exports.reset = reset;
exports.scope = scope;
