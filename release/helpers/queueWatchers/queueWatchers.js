'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var constants = require('../../constants.js');
require('../../utils/shiftSet/index.js');
require('../clearWatchers/index.js');
var shiftSet = require('../../utils/shiftSet/shiftSet.js');
var clearWatcher = require('../clearWatchers/clearWatcher.js');

const cacheStack = new Set();
const observersStack = new Set();
let currentCache;
let currentObserver;
let forcedQueueWatchers = false;
function forceQueueWatchers() {
    if (forcedQueueWatchers)
        return;
    forcedQueueWatchers = true;
    while ((currentCache = shiftSet.shiftSet(cacheStack)) || (currentObserver = shiftSet.shiftSet(observersStack))) {
        if (currentCache) {
            currentCache.invalid = true;
            continue;
        }
        clearWatcher.clearWatcher(currentObserver);
        currentObserver.update();
    }
    forcedQueueWatchers = false;
}
function queueWatchers(watchers) {
    const useLoop = !constants.scope.eventDeep && !observersStack.size && !cacheStack.size;
    const oldObserversStack = [...observersStack];
    observersStack.clear();
    watchers.forEach(watcher => {
        observersStack.add(watcher);
        if (watcher.isCache) {
            cacheStack.add(watcher);
        }
    });
    oldObserversStack.forEach(observer => observersStack.add(observer));
    if (useLoop) {
        forceQueueWatchers();
    }
}

exports.forceQueueWatchers = forceQueueWatchers;
exports.queueWatchers = queueWatchers;
