'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Scope = require('./Scope.js');

function reset() {
    Scope['default'].actionWatchers = Scope['default'].activeWatcher = undefined;
}

exports.reset = reset;
