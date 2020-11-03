'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Scope = require('./Scope.js');
var Watch = require('./Watch.js');
var stateValue = require('./stateValue.js');
var State = require('./State.js');
var utils = require('./utils.js');

var Computed = /** @class */ (function () {
    function Computed(target) {
        this.target = target;
        this._value = new State['default']();
        this._watchersCount = 0;
    }
    Object.defineProperty(Computed.prototype, "value", {
        get: function () {
            var _this = this;
            var destructor = function () {
                _this._watchersCount--;
                if (!_this._watchersCount) {
                    _this._watcher.destructor();
                    _this._watcher = undefined;
                }
            };
            if (Watch.onDestructor(destructor)) {
                this._watchersCount++;
            }
            if (!this._watchersCount) {
                return this.target();
            }
            if (!this._watcher) {
                utils.lock(function () {
                    _this._watcher = new Watch['default'](function () {
                        _this._value.value = _this.target();
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
function computed(target, propertyKey, descriptor) {
    var get = descriptor.get;
    return Object.assign({}, descriptor, {
        get: function () {
            var _this = this;
            var values = stateValue['default'](this);
            if (!(propertyKey in values)) {
                utils.lock(function () { return values[propertyKey] = new Computed(get.bind(_this)); });
            }
            return values[propertyKey].value;
        }
    });
}

exports.scope = Scope['default'];
exports.Watch = Watch['default'];
exports.onClear = Watch.onClear;
exports.onDestructor = Watch.onDestructor;
exports.onUpdate = Watch.onUpdate;
exports.watch = Watch.watch;
exports.stateValues = stateValue['default'];
exports.State = State['default'];
exports.state = State.state;
exports.Computed = Computed;
exports.computed = computed;
exports.default = Computed;
