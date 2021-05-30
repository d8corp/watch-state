import { Watch } from '../Watch/Watch.es6.js';
import { State } from '../State/State.es6.js';

class Cache extends Watch {
    constructor(watcher, freeParent, fireImmediately) {
        super(watcher, freeParent, !fireImmediately);
    }
    destroy() {
        this.updated = false;
        return super.destroy();
    }
    clear() {
        var _a, _b;
        if ((_b = (_a = this._state) === null || _a === void 0 ? void 0 : _a.watchers) === null || _b === void 0 ? void 0 : _b.size) {
            this.update();
        }
        else {
            this.destroy();
        }
    }
    run() {
        this.value = super.run();
        this.updated = true;
    }
    get state() {
        if (!this._state) {
            this._state = new State();
        }
        return this._state;
    }
    get value() {
        if (!this.updated) {
            this.update();
        }
        return this.state.value;
    }
    set value(value) {
        this.state.value = value;
    }
}

export default Cache;
export { Cache };
