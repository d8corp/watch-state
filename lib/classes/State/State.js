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
    Object.defineProperty(State.prototype, "value", {
        get: function () {
            var _this = this;
            var activeWatcher = utils_scope_scope['default'].activeWatcher, activeCache = utils_scope_scope['default'].activeCache;
            if (activeWatcher) {
                var watchers_1 = this.watchers;
                if (activeCache) {
                    var caches_1 = this.caches;
                    if (!caches_1.has(activeCache)) {
                        caches_1.add(activeCache);
                        activeWatcher.onClear(function (update) {
                            if (!update || caches_1 === _this.caches) {
                                caches_1.delete(activeCache);
                            }
                        });
                    }
                }
                else if (!watchers_1.has(activeWatcher)) {
                    watchers_1.add(activeWatcher);
                    activeWatcher.onClear(function (update) {
                        if (!update || watchers_1 === _this.watchers) {
                            watchers_1.delete(activeWatcher);
                        }
                    });
                }
            }
            return this.target;
        },
        set: function (value) {
            if (value !== this.target) {
                this.target = value;
                var activeWatcher = utils_scope_scope['default'].activeWatcher;
                utils_scope_scope['default'].activeWatcher = undefined;
                this.update();
                utils_scope_scope['default'].activeWatcher = activeWatcher;
            }
        },
        enumerable: false,
        configurable: true
    });
    State.prototype.update = function () {
        var caches = this.updateCache();
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
        if (caches) {
            utils_createEvent_createEvent['default'](function () { return caches.forEach(function (cache) { return cache.checkWatcher(); }); })();
        }
    };
    State.prototype.updateCache = function () {
        var caches = this.caches;
        if (caches.size) {
            this.caches = new Set();
            return checkCaches(caches);
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
