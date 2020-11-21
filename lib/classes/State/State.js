'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils_scope_scope = require('../../utils/scope/scope.js');
var utils_createEvent_createEvent = require('../../utils/createEvent/createEvent.js');

var State = /** @class */ (function () {
    function State(value) {
        this.watchers = new Set();
        this.caches = new Set();
        this.target = value;
    }
    State.prototype.getValue = function () {
        var _this = this;
        var activeWatcher = utils_scope_scope['default'].activeWatcher, activeCache = utils_scope_scope['default'].activeCache;
        var _a = this, watchers = _a.watchers, caches = _a.caches;
        if (activeWatcher) {
            if (activeCache) {
                if (!caches.has(activeCache)) {
                    caches.add(activeCache);
                    activeWatcher.onClear(function (update) {
                        if (!update || caches === _this.caches) {
                            caches.delete(activeCache);
                        }
                    });
                }
            }
            else if (!watchers.has(activeWatcher)) {
                watchers.add(activeWatcher);
                activeWatcher.onClear(function (update) {
                    if (!update || watchers === _this.watchers) {
                        watchers.delete(activeWatcher);
                    }
                });
            }
        }
        return this.target;
    };
    State.prototype.setValue = function (value) {
        if (value !== this.target) {
            this.target = value;
            this.update();
        }
    };
    Object.defineProperty(State.prototype, "value", {
        get: function () {
            return this.getValue();
        },
        set: function (value) {
            this.setValue(value);
        },
        enumerable: false,
        configurable: true
    });
    State.prototype.update = function () {
        this.updateCache();
        var watchers = this.watchers;
        if (watchers.size) {
            this.watchers = new Set();
            if (utils_scope_scope['default'].activeWatchers) {
                watchers.forEach(function (watcher) { return utils_scope_scope['default'].activeWatchers.add(watcher); });
            }
            else {
                watchers.forEach(function (watcher) { return watcher.update(); });
            }
        }
    };
    State.prototype.updateCache = function () {
        var caches = this.caches;
        if (caches.size) {
            this.caches = new Set();
            var watchers_1 = checkCaches(caches);
            utils_createEvent_createEvent['default'](function () { return watchers_1.forEach(function (cache) { return cache.checkWatcher(); }); })();
        }
    };
    return State;
}());
function checkCaches(caches, watchers) {
    if (watchers === void 0) { watchers = []; }
    caches.forEach(function (cache) {
        var watcher = cache.watcher, state = cache.state;
        if (watcher) {
            if (state.watchers.size) {
                watchers.push(cache);
            }
            if (state.caches.size) {
                checkCaches(state.caches, watchers);
            }
            cache.destructor();
        }
    });
    return watchers;
}

exports.State = State;
exports.default = State;
