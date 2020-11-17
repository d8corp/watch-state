import scope from '../../utils/scope/scope.es6.js';
import '../../utils/createEvent/createEvent.es6.js';
import unwatch from '../../utils/unwatch/unwatch.es6.js';
import '../../utils/onClear/onClear.es6.js';
import Watch from '../Watch/Watch.es6.js';
import { State } from '../State/State.es6.js';

class Cache {
    constructor(target) {
        this.target = target;
        this.state = new State();
    }
    destructor() {
        var _a;
        (_a = this.watcher) === null || _a === void 0 ? void 0 : _a.destructor();
    }
    checkWatcher() {
        if (!this.watcher) {
            unwatch(() => {
                const watcher = this.watcher = new Watch(update => {
                    if (watcher === this.watcher) {
                        if (!update || this.state.watchers.size || this.state.caches.size) {
                            const oldActiveCache = scope.activeCache;
                            scope.activeCache = this;
                            this.state.value = this.target();
                            scope.activeCache = oldActiveCache;
                        }
                        else {
                            this.watcher = undefined;
                        }
                    }
                });
            });
        }
    }
    get value() {
        this.checkWatcher();
        return this.state.value;
    }
}

export default Cache;
export { Cache };
