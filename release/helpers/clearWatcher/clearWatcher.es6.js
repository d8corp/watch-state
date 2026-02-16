import '../destroyWatchers/index.es6.js';
import { destroyWatchers } from '../destroyWatchers/destroyWatchers.es6.js';

const clearStack = [];
let currentWatcher;
function clearWatcher(watcher) {
    const skipLoop = Boolean(clearStack.length);
    clearStack.push(watcher);
    if (skipLoop)
        return;
    while ((currentWatcher = clearStack.shift())) {
        currentWatcher.childrenObservers.forEach(destroyWatchers);
        for (const destructor of currentWatcher.destructors) {
            currentWatcher.destructors.delete(destructor);
            destructor();
        }
    }
}

export { clearWatcher };
