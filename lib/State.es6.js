import scope from './Scope.es6.js';
import { onClear } from './Watch.es6.js';
import stateValues from './stateValue.es6.js';

class State {
    constructor(target) {
        this.target = target;
        this.watchers = new Set();
    }
    get value() {
        const currentWatcher = scope.activeWatcher;
        if (currentWatcher && !this.watchers.has(currentWatcher)) {
            this.watchers.add(currentWatcher);
            onClear(() => this.watchers.delete(currentWatcher));
        }
        return this.target;
    }
    set value(value) {
        if (value !== this.target) {
            this.target = value;
            const { watchers } = this;
            if (watchers.size) {
                this.watchers = new Set();
                if (scope.actionWatchers) {
                    watchers.forEach(watcher => scope.actionWatchers.add(watcher));
                }
                else {
                    watchers.forEach(watcher => watcher.update());
                }
            }
        }
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

export default state;
export { State, state };
