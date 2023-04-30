'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var constants = require('../constants.js');
require('../helpers/index.js');
require('../Observable/index.js');
require('../Watch/index.js');
var Observable = require('../Observable/Observable.js');
var invalidateCache = require('../helpers/invalidateCache/invalidateCache.js');
var Watch = require('../Watch/Watch.js');
var watchWithScope = require('../helpers/watchWithScope/watchWithScope.js');
var queueWatchers = require('../helpers/queueWatchers/queueWatchers.js');
var destroyWatchers = require('../helpers/destroyWatchers/destroyWatchers.js');

class Cache extends Observable.Observable {
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
            const { activeWatcher } = constants.scope;
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
        invalidateCache.invalidateCache(this);
        const parents = [...this.observers];
        let parent;
        while ((parent = parents.pop())) {
            if (parent instanceof Watch.Watch) {
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
            watchWithScope.watchWithScope(this, () => {
                const newValue = this.watcher(this.updated ? this.updated = true : false);
                if (newValue !== this.rawValue) {
                    this.rawValue = newValue;
                    queueWatchers.queueWatchers(this.observers);
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
        destroyWatchers.destroyWatchers(this);
    }
}

exports.Cache = Cache;
