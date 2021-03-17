import scope from '../../utils/scope/scope.es6.js';
import createEvent from '../../utils/createEvent/createEvent.es6.js';

class State {
    constructor(value) {
        this.watchers = new Set();
        this.caches = new Set();
        this.target = value;
    }
    /**
     * the field returns current state.
     * ```typescript
     * const state = new State(1)
     * console.log(state.value) // 1
     * ```
     * */
    get value() {
        const { activeWatcher } = scope;
        if (activeWatcher) {
            const { activeCache } = scope;
            const type = activeCache ? 'caches' : 'watchers';
            const set = this[type];
            const item = activeCache || activeWatcher;
            if (!set.has(item)) {
                set.add(item);
                activeWatcher.onClear(update => {
                    if (!update || set === this[type]) {
                        set.delete(item);
                    }
                });
            }
        }
        return this.target;
    }
    /**
     * Change the state.
     * ```typescript
     * const state = new State(1)
     * console.log(state.value) // 1
     *
     * state.value = 2
     * console.log(state.value) // 2
     * ```
     * */
    set value(value) {
        if (value !== this.target) {
            this.target = value;
            const { activeWatcher } = scope;
            scope.activeWatcher = undefined;
            this.update();
            scope.activeWatcher = activeWatcher;
        }
    }
    /**
     * Update all watchers of the state.
     * ```typescript
     * const state = new State(1)
     * new Watch(() => console.log(state.value))
     * // 1
     * state.update()
     * // 1
     * ```
     * */
    update() {
        const { caches } = this;
        let currentCaches;
        if (caches.size) {
            this.caches = new Set();
            currentCaches = checkCaches(caches);
        }
        const { watchers } = this;
        if (watchers.size) {
            this.watchers = new Set();
            if (scope.eventWatchers) {
                watchers.forEach(watcher => scope.eventWatchers.add(watcher));
            }
            else {
                watchers.forEach(watcher => watcher.update());
            }
        }
        if (currentCaches) {
            createEvent(() => currentCaches.forEach(cache => cache.checkWatcher()))();
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
