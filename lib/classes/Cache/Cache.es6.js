import '../../utils/scope/scope.es6.js';
import unwatch from '../../utils/unwatch/unwatch.es6.js';
import '../../utils/onClear/onClear.es6.js';
import Watch from '../Watch/Watch.es6.js';
import { State } from '../State/State.es6.js';

class Cache {
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

export default Cache;
export { Cache };
