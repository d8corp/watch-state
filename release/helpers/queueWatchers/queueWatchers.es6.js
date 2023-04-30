import { scope } from '../../constants.es6.js';
import '../../utils/shiftSet/index.es6.js';
import '../clearWatchers/index.es6.js';
import { shiftSet } from '../../utils/shiftSet/shiftSet.es6.js';
import { clearWatcher } from '../clearWatchers/clearWatcher.es6.js';

const cacheStack = new Set();
const observersStack = new Set();
let currentCache;
let currentObserver;
function forceQueueWatchers() {
    while ((currentCache = shiftSet(cacheStack)) || (currentObserver = shiftSet(observersStack))) {
        if (currentCache) {
            currentCache.invalid = true;
            continue;
        }
        clearWatcher(currentObserver);
        currentObserver.update();
    }
}
function queueWatchers(watchers) {
    const useLoop = !scope.eventDeep && !observersStack.size && !cacheStack.size;
    watchers.forEach(watcher => {
        observersStack.add(watcher);
        if (watcher.isCache) {
            cacheStack.add(watcher);
        }
    });
    if (!useLoop) {
        return;
    }
    forceQueueWatchers();
}

export { forceQueueWatchers, queueWatchers };
