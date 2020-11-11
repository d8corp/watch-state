'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Scope = require('./Scope.js');
var Watch = require('./Watch.js');
var State = require('./State.js');

var Computed = /** @class */ (function () {
    function Computed(target) {
        this.target = target;
        this._value = new State.State();
    }
    Computed.prototype.destructor = function () {
        var _a;
        (_a = this._watcher) === null || _a === void 0 ? void 0 : _a.destructor();
    };
    Object.defineProperty(Computed.prototype, "value", {
        get: function () {
            var _this = this;
            if (!this._watcher) {
                Watch.unwatch(function () {
                    _this._watcher = new Watch['default'](function (update) {
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
    return Computed;
}());

exports.scope = Scope['default'];
exports.Watch = Watch['default'];
exports.onClear = Watch.onClear;
exports.onDestructor = Watch.onDestructor;
exports.unwatch = Watch.unwatch;
exports.watch = Watch.watch;
exports.State = State.State;
exports.Computed = Computed;
exports.default = Computed;
