import { Watch } from '../Watch/Watch.es6.js';
import { State } from '../State/State.es6.js';

/**
 * You can cache computed state.
 * The watcher will not be triggered while new result is the same.
 * ```javascript
 * const name = new State('Foo')
 * const surname = new State('Bar')
 *
 * const fullName = new Cache(() => (
 *   `${name.value} ${surname.value[0]}`
 * ))
 *
 * new Watch(() => {
 *   console.log(fullName.value)
 * })
 * // console.log('Foo B')
 *
 * surname.value = 'Baz'
 * // nothing happens
 *
 * surname.value = 'Quux'
 * // console.log('Foo Q')
 * ```
 * */
class Cache extends Watch {
    constructor(watcher, freeParent, fireImmediately) {
        super(watcher, freeParent, !fireImmediately);
    }
    destroy() {
        return super.destroy();
    }
    run() {
        this.updated = true;
        this.value = super.run();
    }
    get hasWatcher() {
        if (this.updated && this.size) {
            for (const watcher of this._state.watchers) {
                if (!(watcher instanceof Cache) || watcher.hasWatcher) {
                    return true;
                }
            }
        }
    }
    get size() {
        var _a, _b;
        return (_b = (_a = this._state) === null || _a === void 0 ? void 0 : _a.watchers) === null || _b === void 0 ? void 0 : _b.size;
    }
    deepUpdate() {
        this.updated = false;
        this.destroy();
        if (this.size) {
            for (const watcher of this._state.watchers) {
                watcher.deepUpdate();
            }
        }
    }
    update() {
        if (this.updated) {
            if (this.hasWatcher) {
                this.forceUpdate();
            }
            else {
                this.deepUpdate();
            }
        }
    }
    get state() {
        return this._state || (this._state = new State());
    }
    get value() {
        if (!this.updated) {
            this.forceUpdate();
        }
        return this.state.value;
    }
    set value(value) {
        this.state.value = value;
    }
}

export { Cache };
