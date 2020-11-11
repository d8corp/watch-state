'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils_scope_scope = require('../../utils/scope/scope.js');
var utils_onClear_onClear = require('../../utils/onClear/onClear.js');

var State = /** @class */ (function () {
    function State(value) {
        this.target = value;
    }
    Object.defineProperty(State.prototype, "value", {
        get: function () {
            var _this = this;
            var activeWatcher = utils_scope_scope['default'].activeWatcher;
            var watchers = this.watchers;
            if (activeWatcher && !watchers.has(activeWatcher)) {
                watchers.add(activeWatcher);
                utils_onClear_onClear['default'](function (update) {
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
            if (utils_scope_scope['default'].activeWatchers) {
                watchers.forEach(function (watcher) { return utils_scope_scope['default'].activeWatchers.add(watcher); });
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

exports.State = State;
exports.default = State;
