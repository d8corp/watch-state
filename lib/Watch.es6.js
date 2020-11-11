import scope from './Scope.es6.js';
export { default as scope } from './Scope.es6.js';

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
        return this;
    }
    destructor() {
        this.clear(this.destructors, false);
        return this;
    }
    clear(callbacks, update) {
        if (callbacks) {
            for (let i = 0; i < callbacks.length; i++) {
                callbacks[i](update);
            }
        }
        this.cleaners = undefined;
        this.destructors = undefined;
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
function onClear(callback) {
    if (scope.activeWatcher) {
        scope.activeWatcher.onClear(callback);
        return true;
    }
    return false;
}
function unwatch(target) {
    const prevWatcher = scope.activeWatcher;
    scope.activeWatcher = undefined;
    const result = target();
    scope.activeWatcher = prevWatcher;
    return result;
}

export default Watch;
export { Watch, onClear, onDestructor, unwatch, watch };
