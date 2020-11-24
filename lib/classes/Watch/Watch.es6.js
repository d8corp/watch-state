import scope from '../../utils/scope/scope.es6.js';
import onClear from '../../utils/onClear/onClear.es6.js';

class Watch {
    constructor(target) {
        this.target = target;
        this.rendered = false;
        this.updating = false;
        this.update();
    }
    update() {
        this.updating = true;
        this.clear(this.cleaners, this.rendered);
        onClear(() => this.destructor());
        const prevWatcher = scope.activeWatcher;
        scope.activeWatcher = this;
        this.target(this.rendered);
        scope.activeWatcher = prevWatcher;
        this.rendered = true;
        this.updating = false;
        return this;
    }
    destructor() {
        this.clear(this.destructors, false);
        return this;
    }
    clear(callbacks, update) {
        this.cleaners = undefined;
        this.destructors = undefined;
        if (callbacks) {
            for (let i = 0; i < callbacks.length; i++) {
                callbacks[i](update);
            }
        }
        return this;
    }
    onDestructor(callback) {
        if (this.destructors) {
            this.destructors.push(callback);
        }
        else {
            this.destructors = [callback];
        }
        return this;
    }
    onUpdate(callback) {
        if (this.cleaners) {
            this.cleaners.push(callback);
        }
        else {
            this.cleaners = [callback];
        }
        return this;
    }
    onClear(callback) {
        this.onUpdate(callback);
        this.onDestructor(callback);
        return this;
    }
}

export default Watch;
export { Watch };
