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
        /**
         * the field returns current state.
         * ```typescript
         * const state = new State(1)
         * console.log(state.value) // 1
         * ```
         * */
        get: function () {
            var _this = this;
            var activeWatcher = utils_scope_scope['default'].activeWatcher;
            if (activeWatcher) {
                var activeCache = utils_scope_scope['default'].activeCache;
                var type_1 = activeCache ? 'caches' : 'watchers';
                var set_1 = this[type_1];
                var item_1 = activeCache || activeWatcher;
                if (!set_1.has(item_1)) {
                    set_1.add(item_1);
                    activeWatcher.onClear(function (update) {
                        if (!update || set_1 === _this[type_1]) {
                            set_1.delete(item_1);
                        }
                    });
                }
            }
            return this.target;
        },
        /**
         * Change the state.
         * ```typescript
         * const state = new State(1)
         * console.log(state.value) // 1
         *
         * state.value = 2
         * console.log(state.value) // 2
         * ```
         * */
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
    /**
     * Update all watchers of the state.
     * ```typescript
     * const state = new State(1)
     * new Watch(() => console.log(state.value))
     * // 1
     * state.update()
     * // 1
     * ```
     * */
    State.prototype.update = function () {
        var caches = this.caches;
        var currentCaches;
        if (caches.size) {
            this.caches = new Set();
            currentCaches = checkCaches(caches);
        }
        var watchers = this.watchers;
        if (watchers.size) {
            this.watchers = new Set();
            if (utils_scope_scope['default'].eventWatchers) {
                watchers.forEach(function (watcher) { return utils_scope_scope['default'].eventWatchers.add(watcher); });
            }
            else {
                watchers.forEach(function (watcher) { return watcher.update(); });
            }
        }
        if (currentCaches) {
            utils_createEvent_createEvent['default'](function () { return currentCaches.forEach(function (cache) { return cache.checkWatcher(); }); })();
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
