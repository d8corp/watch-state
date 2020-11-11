import scope from './Scope.es6.js';
export { default as scope } from './Scope.es6.js';
import { onClear } from './Watch.es6.js';
export { default as Watch, onClear, onDestructor, onUpdate, watch } from './Watch.es6.js';
import stateValues from './stateValue.es6.js';
export { default as stateValues } from './stateValue.es6.js';

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
            const { watchers } = this;
            if (watchers.size) {
                this._watchers = undefined;
                if (scope.actionWatchers) {
                    watchers.forEach(watcher => scope.actionWatchers.add(watcher));
                }
                else {
                    watchers.forEach(watcher => watcher.update());
                }
            }
        }
    }
    get watchers() {
        return this._watchers || (this._watchers = new Set());
    }
}
function state(target, propertyKey) {
    Object.defineProperty(target, propertyKey, {
        get() {
            const values = stateValues(this);
            if (!(propertyKey in values)) {
                values[propertyKey] = new State();
            }
            return values[propertyKey].value;
        },
        set(v) {
            const values = stateValues(this);
            if (!(propertyKey in values)) {
                values[propertyKey] = new State(v);
            }
            else {
                values[propertyKey].value = v;
            }
        },
        enumerable: true
    });
}

export default State;
export { State, state };