import './Scope.es6.js';
import { onDestructor, lock, Watch } from './Watch.es6.js';
import stateValues from './stateValue.es6.js';
import { State } from './State.es6.js';

class Computed {
    constructor(target) {
        this.target = target;
        this._value = new State();
        this._watchersCount = 0;
    }
    get value() {
        if (onDestructor(() => {
            this._watchersCount--;
            if (!this._watchersCount) {
                this._watcher.destructor();
            }
        })) {
            this._watchersCount++;
        }
        if (!this._watchersCount) {
            return this.target();
        }
        if (!this._watcher) {
            lock(() => {
                this._watcher = new Watch(() => {
                    this._value.value = this.target();
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
                lock(() => values[propertyKey] = new Computed(get.bind(this)));
            }
            return values[propertyKey].value;
        }
    });
}

export default Computed;
export { Computed, computed };
