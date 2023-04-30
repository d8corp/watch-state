'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('../destroyWatchers/index.js');
var destroyWatchers = require('../destroyWatchers/destroyWatchers.js');

const clearStack = [];
let currentWatcher;
function clearWatcher(watcher) {
    const skipLoop = Boolean(clearStack.length);
    clearStack.push(watcher);
    if (skipLoop)
        return;
    while ((currentWatcher = clearStack.shift())) {
        currentWatcher.childWatchers.forEach(destroyWatchers.destroyWatchers);
        for (const destructor of currentWatcher.destructors) {
            currentWatcher.destructors.delete(destructor);
            destructor();
        }
    }
}

exports.clearWatcher = clearWatcher;
