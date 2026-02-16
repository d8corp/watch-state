'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var constants = require('../../constants.js');

function bindObserver(observer) {
    const { activeWatcher } = constants.scope;
    if (activeWatcher) {
        activeWatcher.childrenObservers.add(observer);
        activeWatcher.destructors.add(() => {
            activeWatcher.childrenObservers.delete(observer);
        });
    }
}

exports.bindObserver = bindObserver;
