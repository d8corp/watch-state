'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var constants = require('../constants.js');
require('../helpers/index.js');
var watchWithScope = require('../helpers/watchWithScope/watchWithScope.js');
var destroyWatchers = require('../helpers/destroyWatchers/destroyWatchers.js');

class Watch {
    constructor(watcher, freeParent, freeUpdate) {
        // Observer
        this.destructors = new Set();
        this.childWatchers = new Set();
        this.destroyed = false;
        this.isCache = false;
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
        if (!freeUpdate) {
            watchWithScope.watchWithScope(this, () => {
                watcher(false);
            });
        }
    }
    destroy() {
        destroyWatchers.destroyWatchers(this);
    }
    update() {
        if (!this.destroyed) {
            watchWithScope.watchWithScope(this, () => {
                this.watcher(true);
            });
        }
    }
}

exports.Watch = Watch;
