import scope from '../../utils/scope/scope.es6.js';
import onClear from '../../utils/onClear/onClear.es6.js';

class State {
    constructor(value) {
        this.target = value;
    }
    get value() {
        const { activeWatcher } = scope;
        const { watchers } = this;
        if (activeWatcher && !watchers.has(activeWatcher)) {
            watchers.add(activeWatcher);
            onClear(update => {
                if (!update || watchers === this.watchers) {
                    watchers.delete(activeWatcher);
                }
            });
        }
        return this.target;
    }
    set value(value) {
        if (value !== this.target) {
            this.target = value;
            this.update();
        }
    }
    update() {
        const { watchers } = this;
        if (watchers.size) {
            this._watchers = undefined;
            if (scope.activeWatchers) {
                watchers.forEach(watcher => scope.activeWatchers.add(watcher));
            }
            else {
                watchers.forEach(watcher => watcher.update());
            }
        }
    }
    get watchers() {
        return this._watchers || (this._watchers = new Set());
    }
}

export default State;
export { State };
