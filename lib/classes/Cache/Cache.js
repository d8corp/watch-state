'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('../../utils/scope/scope.js');
var utils_unwatch_unwatch = require('../../utils/unwatch/unwatch.js');
require('../../utils/onClear/onClear.js');
var classes_Watch_Watch = require('../Watch/Watch.js');
var classes_State_State = require('../State/State.js');

var Cache = /** @class */ (function () {
    function Cache(target) {
        this.target = target;
        this._value = new classes_State_State.State();
    }
    Cache.prototype.destructor = function () {
        var _a;
        (_a = this._watcher) === null || _a === void 0 ? void 0 : _a.destructor();
    };
    Object.defineProperty(Cache.prototype, "value", {
        get: function () {
            var _this = this;
            if (!this._watcher) {
                utils_unwatch_unwatch['default'](function () {
                    _this._watcher = new classes_Watch_Watch['default'](function (update) {
                        if (!update || _this._value.watchers.size) {
                            _this._value.value = _this.target();
                        }
                        else {
                            _this._watcher = undefined;
                        }
                    });
                });
            }
            return this._value.value;
        },
        enumerable: false,
        configurable: true
    });
    return Cache;
}());

exports.Cache = Cache;
exports.default = Cache;
