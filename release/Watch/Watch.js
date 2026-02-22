'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('../helpers/index.js');
var bindObserver = require('../helpers/bindObserver/bindObserver.js');
var destroyWatchers = require('../helpers/destroyWatchers/destroyWatchers.js');
var watchWithScope = require('../helpers/watchWithScope/watchWithScope.js');

/**
 * Watcher class for reactive state tracking.
 * Executes callback function when observed states change.
 * @class Watch
 * @implements {Observer}
 *
 * @example
 * // Create state
 * const count = new State(0)
 *
 * // Create watcher that logs the state changes
 * new Watch(() => console.log(count.value)) // auto-subscribes to count
 *
 * count.value = 1 // triggers watcher callback
 */
class Watch {
    // TODO: remove in major release
    /** @deprecated Use `children` */
    get childrenObservers() {
        return this.children;
    }
    // TODO: remove in major release
    /** @deprecated Use `childrenObservers` */
    get childWatchers() {
        return this.children;
    }
    // TODO: remove in major release
    /** @deprecated Use `reaction` */
    get watcher() {
        return this.reaction;
    }
    constructor(reaction, freeParent, freeUpdate) {
        this.reaction = reaction;
        /** Whether the watcher has been destroyed */
        this.destroyed = false;
        /** Tracks if the computation has run at least once. */
        this.updated = false;
        /** Cleanup functions to run when watcher is destroyed */
        this.destructors = new Set();
        /** Child observers created within this watcher's scope */
        this.children = new Set();
        if (!freeParent) {
            bindObserver.bindObserver(this);
        }
        if (!freeUpdate) {
            this.update();
        }
    }
    /** Destroy watcher and cleanup all dependencies */
    destroy() {
        destroyWatchers.destroyWatchers(this);
    }
    /** Force watcher update regardless of state changes */
    update() {
        if (!this.destroyed) {
            watchWithScope.watchWithScope(this, () => {
                this.reaction(this.updated); // TODO: remove `this.updated` in major release
                this.updated = true;
            });
        }
    }
}

exports.Watch = Watch;
