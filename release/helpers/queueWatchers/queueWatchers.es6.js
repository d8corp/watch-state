import { scope } from '../../constants.es6.js';
import '../../utils/shiftSet/index.es6.js';
import '../clearWatchers/index.es6.js';
import { shiftSet } from '../../utils/shiftSet/shiftSet.es6.js';
import { clearWatcher } from '../clearWatchers/clearWatcher.es6.js';

const cacheStack = new Set();
const observersStack = new Set();
let currentCache;
let currentObserver;
let forcedQueueWatchers = false;
function forceQueueWatchers() {
    if (forcedQueueWatchers)
        return;
    forcedQueueWatchers = true;
    while ((currentCache = shiftSet(cacheStack)) || (currentObserver = shiftSet(observersStack))) {
        if (currentCache) {
            currentCache.invalid = true;
            continue;
        }
        clearWatcher(currentObserver);
        currentObserver.update();
    }
    forcedQueueWatchers = false;
}
function queueWatchers(watchers) {
    const useLoop = !scope.eventDeep && !observersStack.size && !cacheStack.size;
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

export { forceQueueWatchers, queueWatchers };
