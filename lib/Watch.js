'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Scope = require('./Scope.js');

var Watch = /** @class */ (function () {
    function Watch(target) {
        this.target = target;
        this.rendered = false;
        this.update();
    }
    Watch.prototype.update = function () {
        var _this = this;
        this.clear(this.cleaners, this.rendered);
        onClear(function () { return _this.destructor(); });
        var prevWatcher = Scope['default'].activeWatcher;
        Scope['default'].activeWatcher = this;
        this.target(this.rendered);
        Scope['default'].activeWatcher = prevWatcher;
        this.rendered = true;
        return this;
    };
    Watch.prototype.destructor = function () {
        this.clear(this.destructors, false);
        return this;
    };
    Watch.prototype.clear = function (callbacks, update) {
        if (callbacks) {
            for (var i = 0; i < callbacks.length; i++) {
                callbacks[i](update);
            }
        }
        this.cleaners = undefined;
        this.destructors = undefined;
        return this;
    };
    Watch.prototype.onDestructor = function (callback) {
        if (this.destructors) {
            this.destructors.push(callback);
        }
        else {
            this.destructors = [callback];
        }
        return this;
    };
    Watch.prototype.onUpdate = function (callback) {
        if (this.cleaners) {
            this.cleaners.push(callback);
        }
        else {
            this.cleaners = [callback];
        }
        return this;
    };
    Watch.prototype.onClear = function (callback) {
        this.onUpdate(callback);
        this.onDestructor(callback);
        return this;
    };
    return Watch;
}());
function watch(target) {
    return new Watch(target);
}
function onDestructor(callback) {
    if (Scope['default'].activeWatcher) {
        Scope['default'].activeWatcher.onDestructor(callback);
        return true;
    }
    return false;
}
function onClear(callback) {
    if (Scope['default'].activeWatcher) {
        Scope['default'].activeWatcher.onClear(callback);
        return true;
    }
    return false;
}
function unwatch(target) {
    var prevWatcher = Scope['default'].activeWatcher;
    Scope['default'].activeWatcher = undefined;
    var result = target();
    Scope['default'].activeWatcher = prevWatcher;
    return result;
}

exports.scope = Scope['default'];
exports.Watch = Watch;
exports.default = Watch;
exports.onClear = onClear;
exports.onDestructor = onDestructor;
exports.unwatch = unwatch;
exports.watch = watch;
