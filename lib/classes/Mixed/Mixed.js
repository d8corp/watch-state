'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils_scope_scope = require('../../utils/scope/scope.js');
require('../../utils/createEvent/createEvent.js');
var utils_unwatch_unwatch = require('../../utils/unwatch/unwatch.js');
var utils_onClear_onClear = require('../../utils/onClear/onClear.js');
var classes_Watch_Watch = require('../Watch/Watch.js');
var classes_State_State = require('../State/State.js');

var Mixed = /** @class */ (function () {
    function Mixed(target) {
        this.target = target;
        this.state = new classes_State_State.State();
    }
    Mixed.prototype.destructor = function () {
        var _a;
        (_a = this.watcher) === null || _a === void 0 ? void 0 : _a.destructor();
        this.watcher = undefined;
    };
    Mixed.prototype.checkWatcher = function () {
        var _this = this;
        if (!this.watcher) {
            utils_onClear_onClear['default'](function () { return _this.destructor(); });
            utils_unwatch_unwatch['default'](function () {
                var watcher = _this.watcher = new classes_Watch_Watch['default'](function () {
                    if (watcher === _this.watcher) {
                        _this.newValue = 'newValue' in _this ? _this.newValue : _this.target();
                        if (_this.state.target !== _this.newValue) {
                            _this.state.value = _this.newValue;
                        }
                        delete _this.newValue;
                    }
                });
            });
        }
    };
    Object.defineProperty(Mixed.prototype, "value", {
        get: function () {
            if (utils_scope_scope['default'].activeWatcher) {
                this.checkWatcher();
                return this.state.value;
            }
            else {
                return this.target();
            }
        },
        enumerable: false,
        configurable: true
    });
    return Mixed;
}());

exports.Mixed = Mixed;
exports.default = Mixed;
