import '../helpers/index.es6.js';
import { bindObserver } from '../helpers/bindObserver/bindObserver.es6.js';
import { destroyWatchers } from '../helpers/destroyWatchers/destroyWatchers.es6.js';
import { watchWithScope } from '../helpers/watchWithScope/watchWithScope.es6.js';

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
            bindObserver(this);
        }
        if (!freeUpdate) {
            this.update();
        }
    }
    /** Destroy watcher and cleanup all dependencies */
    destroy() {
        destroyWatchers(this);
    }
    /** Force watcher update regardless of state changes */
    update() {
        if (!this.destroyed) {
            watchWithScope(this, () => {
                this.reaction(this.updated); // TODO: remove `this.updated` in major release
                this.updated = true;
            });
        }
    }
}

export { Watch };
