'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Scope = require('./Scope.js');
var Watch = require('./Watch.js');
var stateValue = require('./stateValue.js');

var State = /** @class */ (function () {
    function State(target) {
        this.target = target;
        this.watchers = new Set();
    }
    Object.defineProperty(State.prototype, "value", {
        get: function () {
            var _this = this;
            var currentWatcher = Scope['default'].activeWatcher;
            if (currentWatcher && !this.watchers.has(currentWatcher)) {
                this.watchers.add(currentWatcher);
                Watch.onClear(function () { return _this.watchers.delete(currentWatcher); });
            }
            return this.target;
        },
        set: function (value) {
            if (value !== this.target) {
                this.target = value;
                var watchers = this.watchers;
                if (watchers.size) {
                    this.watchers = new Set();
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
    return State;
}());
function state(target, propertyKey) {
    Object.defineProperty(target, propertyKey, {
        get: function () {
            var values = stateValue(this);
            if (!(propertyKey in values)) {
                values[propertyKey] = new State();
            }
            return values[propertyKey].value;
        },
        set: function (v) {
            var values = stateValue(this);
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

exports.State = State;
exports.default = state;
exports.state = state;
