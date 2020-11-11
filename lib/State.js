'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Scope = require('./Scope.js');
var Watch = require('./Watch.js');

var State = /** @class */ (function () {
    function State(value) {
        this.target = value;
    }
    Object.defineProperty(State.prototype, "value", {
        get: function () {
            var _this = this;
            var activeWatcher = Scope['default'].activeWatcher;
            var watchers = this.watchers;
            if (activeWatcher && !watchers.has(activeWatcher)) {
                watchers.add(activeWatcher);
                Watch.onClear(function (update) {
                    if (!update || watchers === _this.watchers) {
                        watchers.delete(activeWatcher);
                    }
                });
            }
            return this.target;
        },
        set: function (value) {
            if (value !== this.target) {
                this.target = value;
                this.update();
            }
        },
        enumerable: false,
        configurable: true
    });
    State.prototype.update = function () {
        var watchers = this.watchers;
        if (watchers.size) {
            this._watchers = undefined;
            if (Scope['default'].actionWatchers) {
                watchers.forEach(function (watcher) { return Scope['default'].actionWatchers.add(watcher); });
            }
            else {
                watchers.forEach(function (watcher) { return watcher.update(); });
            }
        }
    };
    Object.defineProperty(State.prototype, "watchers", {
        get: function () {
            return this._watchers || (this._watchers = new Set());
        },
        enumerable: false,
        configurable: true
    });
    return State;
}());

exports.scope = Scope['default'];
exports.Watch = Watch['default'];
exports.onClear = Watch.onClear;
exports.onDestructor = Watch.onDestructor;
exports.unwatch = Watch.unwatch;
exports.watch = Watch.watch;
exports.State = State;
exports.default = State;
