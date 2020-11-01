'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Scope = require('./Scope.js');

function reset() {
    Scope['default'].actionWatchers = Scope['default'].activeWatcher = undefined;
}
function lock(target) {
    var prevWatcher = Scope['default'].activeWatcher;
    Scope['default'].activeWatcher = undefined;
    var result = target();
    Scope['default'].activeWatcher = prevWatcher;
    return result;
}

exports.lock = lock;
exports.reset = reset;
