export { default as scope } from './Scope.es6.js';
import Watch, { unwatch } from './Watch.es6.js';
export { default as Watch, onClear, onDestructor, unwatch, watch } from './Watch.es6.js';
import stateValues from './stateValue.es6.js';
export { default as stateValues } from './stateValue.es6.js';
import State from './State.es6.js';
export { default as State, state } from './State.es6.js';

class Computed {
    constructor(target) {
        this.target = target;
        this._value = new State();
    }
    destructor() {
        var _a;
        (_a = this._watcher) === null || _a === void 0 ? void 0 : _a.destructor();
    }
    get value() {
        if (!this._watcher) {
            unwatch(() => {
                this._watcher = new Watch(update => {
                    if (!update || this._value.watchers.size) {
                        this._value.value = this.target();
                    }
                    else {
                        this._watcher = undefined;
                    }
                });
            });
        }
        return this._value.value;
    }
}
function computed(target, propertyKey, descriptor) {
    const { get } = descriptor;
    return Object.assign({}, descriptor, {
        get() {
            const values = stateValues(this);
            if (!(propertyKey in values)) {
                unwatch(() => values[propertyKey] = new Computed(get.bind(this)));
            }
            return values[propertyKey].value;
        }
    });
}

export default Computed;
export { Computed, computed };
