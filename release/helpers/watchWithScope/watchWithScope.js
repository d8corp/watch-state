'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var constants = require('../../constants.js');

function watchWithScope(watcher, target) {
    const prevWatcher = constants.scope.activeWatcher;
    constants.scope.activeWatcher = watcher;
    target();
    constants.scope.activeWatcher = prevWatcher;
}

exports.watchWithScope = watchWithScope;
