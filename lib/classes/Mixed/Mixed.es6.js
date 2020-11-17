import scope from '../../utils/scope/scope.es6.js';
import '../../utils/createEvent/createEvent.es6.js';
import unwatch from '../../utils/unwatch/unwatch.es6.js';
import onClear from '../../utils/onClear/onClear.es6.js';
import Watch from '../Watch/Watch.es6.js';
import { State } from '../State/State.es6.js';

class Mixed {
    constructor(target) {
        this.target = target;
        this.state = new State();
    }
    destructor() {
        var _a;
        (_a = this.watcher) === null || _a === void 0 ? void 0 : _a.destructor();
        this.watcher = undefined;
    }
    checkWatcher() {
        if (!this.watcher) {
            onClear(() => this.destructor());
            unwatch(() => {
                const watcher = this.watcher = new Watch(() => {
                    if (watcher === this.watcher) {
                        this.newValue = 'newValue' in this ? this.newValue : this.target();
                        if (this.state.target !== this.newValue) {
                            this.state.value = this.newValue;
                        }
                        delete this.newValue;
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

export default Mixed;
export { Mixed };
