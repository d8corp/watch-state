'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var scope = {};
function reset() {
    scope.actionWatchers = scope.activeWatcher = undefined;
}

var Watch = /** @class */ (function () {
    function Watch(target) {
        this.target = target;
        this.update();
    }
    Watch.prototype.update = function () {
        var _this = this;
        this.clear();
        onClear(function () { return _this.destructor(); });
        var prevWatcher = scope.activeWatcher;
        scope.activeWatcher = this;
        this.target(this.rendered);
        scope.activeWatcher = prevWatcher;
        this.rendered = true;
    };
    Watch.prototype.destructor = function () {
        var destructors = this.destructors;
        if (destructors) {
            for (var i = 0; i < destructors.length; i++) {
                destructors[i]();
            }
            this.destructors = undefined;
        }
    };
    Watch.prototype.clear = function () {
        var cleaners = this.cleaners;
        if (cleaners) {
            for (var i = 0; i < cleaners.length; i++) {
                cleaners[i]();
            }
            this.cleaners = undefined;
        }
    };
    Watch.prototype.onDestructor = function (callback) {
        if (this.destructors) {
            this.destructors.push(callback);
        }
        else {
            this.destructors = [callback];
        }
    };
    Watch.prototype.onUpdate = function (callback) {
        if (this.cleaners) {
            this.cleaners.push(callback);
        }
        else {
            this.cleaners = [callback];
        }
    };
    Watch.prototype.onClear = function (callback) {
        this.onUpdate(callback);
        this.onDestructor(callback);
    };
    return Watch;
}());
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
    var prevWatcher = scope.activeWatcher;
    scope.activeWatcher = undefined;
    var result = target();
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
                var watchers = scope.actionWatchers = new Set();
                var result = target.apply(this, arguments);
                scope.actionWatchers = undefined;
                watchers.forEach(function (watcher) { return watcher.update(); });
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

var VALUES = Symbol('state values');
function stateValues(target) {
    if (!(VALUES in target)) {
        target[VALUES] = {};
    }
    return target[VALUES];
}

var State = /** @class */ (function () {
    function State(target) {
        this.target = target;
        this.watchers = new Set();
    }
    Object.defineProperty(State.prototype, "value", {
        get: function () {
            var _this = this;
            var currentWatcher = scope.activeWatcher;
            if (currentWatcher && !this.watchers.has(currentWatcher)) {
                this.watchers.add(currentWatcher);
                onClear(function () { return _this.watchers.delete(currentWatcher); });
            }
            return this.target;
        },
        set: function (value) {
            if (value !== this.target) {
                this.target = value;
                var watchers = this.watchers;
                if (watchers.size) {
                    this.watchers = new Set();
                    if (scope.actionWatchers) {
                        watchers.forEach(function (watcher) { return scope.actionWatchers.add(watcher); });
                    }
                    else {
                        watchers.forEach(function (watcher) { return watcher.update(); });
                    }
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    return State;
}());
function state(target, propertyKey) {
    Object.defineProperty(target, propertyKey, {
        get: function () {
            var values = stateValues(this);
            if (!(propertyKey in values)) {
                values[propertyKey] = new State();
            }
            return values[propertyKey].value;
        },
        set: function (v) {
            var values = stateValues(this);
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

var Computed = /** @class */ (function () {
    function Computed(target) {
        this.target = target;
        this._value = new State();
        this._watchersCount = 0;
    }
    Object.defineProperty(Computed.prototype, "value", {
        get: function () {
            var _this = this;
            if (onDestructor(function () {
                _this._watchersCount--;
                if (!_this._watchersCount) {
                    _this._watcher.destructor();
                }
            })) {
                this._watchersCount++;
            }
            if (!this._watchersCount) {
                return this.target();
            }
            if (!this._watcher) {
                lock(function () {
                    _this._watcher = new Watch(function () {
                        _this._value.value = _this.target();
                    });
                });
            }
            return this._value.value;
        },
        enumerable: false,
        configurable: true
    });
    return Computed;
}());
function computed(target, propertyKey, descriptor) {
    var get = descriptor.get;
    return Object.assign({}, descriptor, {
        get: function () {
            var _this = this;
            var values = stateValues(this);
            if (!(propertyKey in values)) {
                lock(function () { return values[propertyKey] = new Computed(get.bind(_this)); });
            }
            return values[propertyKey].value;
        }
    });
}

exports.Computed = Computed;
exports.State = State;
exports.Watch = Watch;
exports.action = action;
exports.computed = computed;
exports.default = watch;
exports.lock = lock;
exports.onClear = onClear;
exports.onDestructor = onDestructor;
exports.onUpdate = onUpdate;
exports.reset = reset;
exports.scope = scope;
exports.state = state;
exports.watch = watch;
