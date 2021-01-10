import scope from '../../utils/scope/scope.es6.js';
import '../../utils/createEvent/createEvent.es6.js';
import unwatch from '../../utils/unwatch/unwatch.es6.js';
import onClear from '../../utils/onClear/onClear.es6.js';
import Watch from '../Watch/Watch.es6.js';
import { State } from '../State/State.es6.js';

/** @deprecated - use @watch-state/mixer */
class Mixer {
    constructor(target) {
        this.target = target;
        this.state = new State();
        console.error('The Mixer class will be removed, please use @watch-state/mixer');
    }
    destructor() {
        var _a;
        (_a = this.watcher) === null || _a === void 0 ? void 0 : _a.destructor();
        this.watcher = undefined;
    }
    checkWatcher() {
        onClear(() => {
            if (this.watcher && !this.watcher.updating) {
                this.destructor();
            }
        });
        if (!this.watcher) {
            unwatch(() => {
                let watcher;
                watcher = this.watcher = new Watch(update => {
                    if (!watcher || watcher === this.watcher) {
                        if (!update || this.state.watchers.size || this.state.caches.size) {
                            this.state.value = this.target();
                        }
                        else {
                            this.destructor();
                        }
                    }
                });
            });
        }
    }
    get value() {
        if (scope.activeWatcher) {
            this.checkWatcher();
            return this.state.value;
        }
        else {
            return this.target();
        }
    }
}

export default Mixer;
export { Mixer };
