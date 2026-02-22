import { scope } from '../constants.es6.js';

/**
 * Base reactive value **requiring subclasses to implement `update()`** for watcher notifications.
 *
 * Provides automatic observer tracking when `value` is accessed in `Observer` (`State`, `Compute`).
 *
 * @class Observable
 * @template V - state value type
 */
class Observable {
    constructor() {
        /** Set of registered observers */
        this.observers = new Set();
    }
    /** @deprecated Use raw field */
    get rawValue() {
        return this.raw;
    }
    /** @deprecated Use raw field */
    set rawValue(raw) {
        this.raw = raw;
    }
    /**
     * Current value with automatic subscription.
     *
     * Accessing `value` inside an `Observer` automatically subscribes the watcher.
     *
     * @example
     * new Watch(() => console.log(state.value)) // auto-subscribes
     */
    get value() {
        const { activeWatcher } = scope;
        if (activeWatcher) {
            this.observers.add(activeWatcher);
            activeWatcher.destructors.add(() => {
                this.observers.delete(activeWatcher);
            });
        }
        return this.raw;
    }
}

export { Observable };
