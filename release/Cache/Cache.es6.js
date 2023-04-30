import { scope } from '../constants.es6.js';
import '../helpers/index.es6.js';
import '../Observable/index.es6.js';
import '../Watch/index.es6.js';
import { Observable } from '../Observable/Observable.es6.js';
import { invalidateCache } from '../helpers/invalidateCache/invalidateCache.es6.js';
import { Watch } from '../Watch/Watch.es6.js';
import { watchWithScope } from '../helpers/watchWithScope/watchWithScope.es6.js';
import { queueWatchers } from '../helpers/queueWatchers/queueWatchers.es6.js';
import { destroyWatchers } from '../helpers/destroyWatchers/destroyWatchers.es6.js';

class Cache extends Observable {
    constructor(watcher, freeParent, fireImmediately) {
        super();
        this.invalid = true;
        this.updated = false;
        this.destroyed = false;
        this.isCache = true;
        // Observer
        this.destructors = new Set();
        this.childWatchers = new Set();
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
        if (fireImmediately) {
            this.forceUpdate();
        }
    }
    update() {
        invalidateCache(this);
        const parents = [...this.observers];
        let parent;
        while ((parent = parents.pop())) {
            if (parent instanceof Watch) {
                return this.forceUpdate();
            }
            if (parent instanceof Cache) {
                parents.push(...parent.observers);
            }
        }
    }
    forceUpdate() {
        if (!this.destroyed) {
            this.invalid = false;
            watchWithScope(this, () => {
                const newValue = this.watcher(this.updated ? this.updated = true : false);
                if (newValue !== this.rawValue) {
                    this.rawValue = newValue;
                    queueWatchers(this.observers);
                }
            });
        }
    }
    get value() {
        if (this.invalid) {
            this.forceUpdate();
        }
        return this.destroyed ? this.rawValue : super.value;
    }
    destroy() {
        destroyWatchers(this);
    }
}

export { Cache };
