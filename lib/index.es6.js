const scope = {};
function reset() {
    scope.actionWatchers = scope.activeWatcher = undefined;
}

class Watch {
    constructor(target) {
        this.target = target;
        this.update();
    }
    update() {
        this.clear();
        onClear(() => this.destructor());
        const prevWatcher = scope.activeWatcher;
        scope.activeWatcher = this;
        this.target(this.rendered);
        scope.activeWatcher = prevWatcher;
        this.rendered = true;
    }
    destructor() {
        const { destructors } = this;
        if (destructors) {
            for (let i = 0; i < destructors.length; i++) {
                destructors[i]();
            }
            this.destructors = undefined;
        }
    }
    clear() {
        const { cleaners } = this;
        if (cleaners) {
            for (let i = 0; i < cleaners.length; i++) {
                cleaners[i]();
            }
            this.cleaners = undefined;
        }
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

function action(target, propertyKey, descriptor) {
    if (typeof target === 'function') {
        return function () {
            if (scope.actionWatchers) {
                return target.apply(this, arguments);
            }
            else {
                const watchers = scope.actionWatchers = new Set();
                const result = target.apply(this, arguments);
                scope.actionWatchers = undefined;
                watchers.forEach(watcher => watcher.update());
                return result;
            }
        };
    }
    else {
        return Object.assign({}, descriptor, {
            value: action(descriptor.value)
        });
    }
}

const VALUES = Symbol('state values');
function stateValues(target) {
    if (!(VALUES in target)) {
        target[VALUES] = {};
    }
    return target[VALUES];
}

class State {
    constructor(target) {
        this.target = target;
        this.watchers = new Set();
    }
    get value() {
        const currentWatcher = scope.activeWatcher;
        if (currentWatcher && !this.watchers.has(currentWatcher)) {
            this.watchers.add(currentWatcher);
            onClear(() => this.watchers.delete(currentWatcher));
        }
        return this.target;
    }
    set value(value) {
        if (value !== this.target) {
            this.target = value;
            const { watchers } = this;
            if (watchers.size) {
                this.watchers = new Set();
                if (scope.actionWatchers) {
                    watchers.forEach(watcher => scope.actionWatchers.add(watcher));
                }
                else {
                    watchers.forEach(watcher => watcher.update());
                }
            }
        }
    }
}
function state(target, propertyKey) {
    Object.defineProperty(target, propertyKey, {
        get() {
            const values = stateValues(this);
            if (!(propertyKey in values)) {
                values[propertyKey] = new State();
            }
            return values[propertyKey].value;
        },
        set(v) {
            const values = stateValues(this);
            if (!(propertyKey in values)) {
                values[propertyKey] = new State(v);
            }
            else {
                values[propertyKey].value = v;
            }
        },
        enumerable: true
    });
}

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

export default watch;
export { Computed, State, Watch, action, computed, lock, onClear, onDestructor, onUpdate, reset, scope, state, watch };
