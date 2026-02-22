'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var constants = require('../../constants.js');

function bindObserver(observer) {
    const { activeWatcher } = constants.scope;
    if (activeWatcher) {
        activeWatcher.children.add(observer);
        activeWatcher.destructors.add(() => {
            activeWatcher.children.delete(observer);
        });
    }
}

exports.bindObserver = bindObserver;
