import { scope } from '../constants.es6.js';
import '../helpers/index.es6.js';
import { watchWithScope } from '../helpers/watchWithScope/watchWithScope.es6.js';
import { destroyWatchers } from '../helpers/destroyWatchers/destroyWatchers.es6.js';

class Watch {
    constructor(watcher, freeParent, freeUpdate) {
        // Observer
        this.destructors = new Set();
        this.childWatchers = new Set();
        this.destroyed = false;
        this.isCache = false;
        this.watcher = watcher;
        if (!freeParent) {
            const { activeWatcher } = scope;
            if (activeWatcher) {
                activeWatcher.childWatchers.add(this);
                activeWatcher.destructors.add(() => {
                    activeWatcher.childWatchers.delete(this);
                });
            }
        }
        if (!freeUpdate) {
            watchWithScope(this, () => {
                watcher(false);
            });
        }
    }
    destroy() {
        destroyWatchers(this);
    }
    update() {
        if (!this.destroyed) {
            watchWithScope(this, () => {
                this.watcher(true);
            });
        }
    }
}

export { Watch };
