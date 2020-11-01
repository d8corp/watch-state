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
    };
    Watch.prototype.destructor = function () {
        this.clear(this.destructors, false);
    };
    Watch.prototype.clear = function (callbacks, update) {
        if (callbacks) {
            for (var i = 0; i < callbacks.length; i++) {
                callbacks[i](update);
            }
        }
        this.cleaners = undefined;
        this.destructors = undefined;
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
    if (Scope['default'].activeWatcher) {
        Scope['default'].activeWatcher.onDestructor(callback);
        return true;
    }
    return false;
}
function onUpdate(callback) {
    if (Scope['default'].activeWatcher) {
        Scope['default'].activeWatcher.onUpdate(callback);
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

exports.scope = Scope['default'];
exports.Watch = Watch;
exports.default = Watch;
exports.onClear = onClear;
exports.onDestructor = onDestructor;
exports.onUpdate = onUpdate;
exports.watch = watch;
