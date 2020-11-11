'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Scope = require('./Scope.js');
var Watch = require('./Watch.js');
var stateValue = require('./stateValue.js');

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
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(State.prototype, "watchers", {
        get: function () {
            return this._watchers || (this._watchers = new Set());
        },
        enumerable: false,
        configurable: true
    });
    return State;
}());
function state(target, propertyKey) {
    Object.defineProperty(target, propertyKey, {
        get: function () {
            var values = stateValue['default'](this);
            if (!(propertyKey in values)) {
                values[propertyKey] = new State();
            }
            return values[propertyKey].value;
        },
        set: function (v) {
            var values = stateValue['default'](this);
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

exports.scope = Scope['default'];
exports.Watch = Watch['default'];
exports.onClear = Watch.onClear;
exports.onDestructor = Watch.onDestructor;
exports.onUpdate = Watch.onUpdate;
exports.watch = Watch.watch;
exports.stateValues = stateValue['default'];
exports.State = State;
exports.default = State;
exports.state = state;