'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var constants = require('../../constants.js');

function watchWithScope(observer, target) {
    const prevObserver = constants.scope.activeWatcher;
    constants.scope.activeWatcher = observer;
    target();
    constants.scope.activeWatcher = prevObserver;
}

exports.watchWithScope = watchWithScope;
