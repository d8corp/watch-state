import scope from './Scope.es6.js';

class Watch {
    constructor(target) {
        this.target = target;
        this.rendered = false;
        this.update();
    }
    update() {
        this.clear(this.cleaners, this.rendered);
        onClear(() => this.destructor());
        const prevWatcher = scope.activeWatcher;
        scope.activeWatcher = this;
        this.target(this.rendered);
        scope.activeWatcher = prevWatcher;
        this.rendered = true;
    }
    destructor() {
        this.clear(this.destructors, false);
    }
    clear(callbacks, update) {
        if (callbacks) {
            for (let i = 0; i < callbacks.length; i++) {
                callbacks[i](update);
            }
        }
        this.cleaners = undefined;
        this.destructors = undefined;
    }
    onDestructor(callback) {
        if (this.destructors) {
            this.destructors.push(callback);
        }
        else {
            this.destructors = [callback];
        }
    }
    onUpdate(callback) {
        if (this.cleaners) {
            this.cleaners.push(callback);
        }
        else {
            this.cleaners = [callback];
        }
    }
    onClear(callback) {
        this.onUpdate(callback);
        this.onDestructor(callback);
    }
}
function watch(target) {
    return new Watch(target);
}
function onDestructor(callback) {
    if (scope.activeWatcher) {
        scope.activeWatcher.onDestructor(callback);
        return true;
    }
    return false;
}
function onUpdate(callback) {
    if (scope.activeWatcher) {
        scope.activeWatcher.onUpdate(callback);
        return true;
    }
    return false;
}
function onClear(callback) {
    if (scope.activeWatcher) {
        scope.activeWatcher.onClear(callback);
        return true;
    }
    return false;
}
function lock(target) {
    const prevWatcher = scope.activeWatcher;
    scope.activeWatcher = undefined;
    const result = target();
    scope.activeWatcher = prevWatcher;
    return result;
}

export default watch;
export { Watch, lock, onClear, onDestructor, onUpdate, watch };
