import scope from '../../utils/scope/scope.es6.js';
import createEvent from '../../utils/createEvent/createEvent.es6.js';

class State {
    constructor(value) {
        this.watchers = new Set();
        this.caches = new Set();
        this.target = value;
    }
    getValue() {
        const { activeWatcher, activeCache } = scope;
        const { watchers, caches } = this;
        if (activeWatcher) {
            if (activeCache) {
                if (!caches.has(activeCache)) {
                    caches.add(activeCache);
                    activeWatcher.onClear(update => {
                        if (!update || caches === this.caches) {
                            caches.delete(activeCache);
                        }
                    });
                }
            }
            else if (!watchers.has(activeWatcher)) {
                watchers.add(activeWatcher);
                activeWatcher.onClear(update => {
                    if (!update || watchers === this.watchers) {
                        watchers.delete(activeWatcher);
                    }
                });
            }
        }
        return this.target;
    }
    setValue(value) {
        if (value !== this.target) {
            this.target = value;
            const { activeWatcher } = scope;
            scope.activeWatcher = undefined;
            this.update();
            scope.activeWatcher = activeWatcher;
        }
    }
    get value() {
        return this.getValue();
    }
    set value(value) {
        this.setValue(value);
    }
    update() {
        const caches = this.updateCache();
        const { watchers } = this;
        if (watchers.size) {
            this.watchers = new Set();
            if (scope.activeWatchers) {
                watchers.forEach(watcher => scope.activeWatchers.add(watcher));
            }
            else {
                watchers.forEach(watcher => watcher.update());
            }
        }
        if (caches) {
            createEvent(() => caches.forEach(cache => cache.checkWatcher()))();
        }
    }
    updateCache() {
        const { caches } = this;
        if (caches.size) {
            this.caches = new Set();
            return checkCaches(caches);
        }
    }
}
function checkCaches(caches, watchers = []) {
    caches.forEach(cache => {
        const { watcher, state } = cache;
        if (watcher) {
            if (state.watchers.size) {
                watchers.push(cache);
            }
            if (state.caches.size) {
                checkCaches(state.caches, watchers);
            }
            cache.destructor();
        }
    });
    return watchers;
}

export default State;
export { State };
