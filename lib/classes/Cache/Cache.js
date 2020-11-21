'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils_scope_scope = require('../../utils/scope/scope.js');
require('../../utils/createEvent/createEvent.js');
var utils_unwatch_unwatch = require('../../utils/unwatch/unwatch.js');
require('../../utils/onClear/onClear.js');
var classes_Watch_Watch = require('../Watch/Watch.js');
var classes_State_State = require('../State/State.js');

var Cache = /** @class */ (function () {
    function Cache(target) {
        this.target = target;
        this.state = new classes_State_State.State();
    }
    Cache.prototype.destructor = function () {
        var watcher = this.watcher;
        this.watcher = undefined;
        watcher === null || watcher === void 0 ? void 0 : watcher.destructor();
    };
    Cache.prototype.checkWatcher = function () {
        var _this = this;
        if (!this.watcher) {
            utils_unwatch_unwatch['default'](function () {
                var watcher;
                watcher = _this.watcher = new classes_Watch_Watch['default'](function (update) {
                    if (!watcher || _this.watcher === watcher) {
                        if (!update || _this.state.watchers.size || _this.state.caches.size) {
                            var oldActiveCache = utils_scope_scope['default'].activeCache;
                            utils_scope_scope['default'].activeCache = _this;
                            _this.state.value = _this.target();
                            utils_scope_scope['default'].activeCache = oldActiveCache;
                        }
                        else {
                            _this.destructor();
                        }
                    }
                });
            });
        }
    };
    Object.defineProperty(Cache.prototype, "value", {
        get: function () {
            this.checkWatcher();
            return this.state.value;
        },
        enumerable: false,
        configurable: true
    });
    return Cache;
}());

exports.Cache = Cache;
exports.default = Cache;
