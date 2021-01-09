'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils_scope_scope = require('../../utils/scope/scope.js');
require('../../utils/createEvent/createEvent.js');
var utils_unwatch_unwatch = require('../../utils/unwatch/unwatch.js');
var utils_onClear_onClear = require('../../utils/onClear/onClear.js');
var classes_Watch_Watch = require('../Watch/Watch.js');
var classes_State_State = require('../State/State.js');

/** @deprecated - use @watch-state/mixer */
var Mixer = /** @class */ (function () {
    function Mixer(target) {
        this.target = target;
        this.state = new classes_State_State.State();
    }
    Mixer.prototype.destructor = function () {
        var _a;
        (_a = this.watcher) === null || _a === void 0 ? void 0 : _a.destructor();
        this.watcher = undefined;
    };
    Mixer.prototype.checkWatcher = function () {
        var _this = this;
        utils_onClear_onClear['default'](function () {
            if (_this.watcher && !_this.watcher.updating) {
                _this.destructor();
            }
        });
        if (!this.watcher) {
            utils_unwatch_unwatch['default'](function () {
                var watcher;
                watcher = _this.watcher = new classes_Watch_Watch['default'](function (update) {
                    if (!watcher || watcher === _this.watcher) {
                        if (!update || _this.state.watchers.size || _this.state.caches.size) {
                            _this.state.value = _this.target();
                        }
                        else {
                            _this.destructor();
                        }
                    }
                });
            });
        }
    };
    Object.defineProperty(Mixer.prototype, "value", {
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
    return Mixer;
}());

exports.Mixer = Mixer;
exports.default = Mixer;
