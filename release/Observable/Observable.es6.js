import { scope } from '../constants.es6.js';

class Observable {
    constructor() {
        this.observers = new Set();
    }
    get value() {
        const { activeWatcher } = scope;
        if (activeWatcher) {
            this.observers.add(activeWatcher);
            activeWatcher.destructors.add(() => {
                this.observers.delete(activeWatcher);
            });
        }
        return this.rawValue;
    }
}

export { Observable };
