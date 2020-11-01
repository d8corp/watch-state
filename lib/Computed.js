'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('./Scope.js');
var Watch = require('./Watch.js');
var stateValue = require('./stateValue.js');
var State = require('./State.js');

var Computed = /** @class */ (function () {
    function Computed(target) {
        this.target = target;
        this._value = new State.State();
        this._watchersCount = 0;
    }
    Object.defineProperty(Computed.prototype, "value", {
        get: function () {
            var _this = this;
            if (Watch.onDestructor(function () {
                _this._watchersCount--;
                if (!_this._watchersCount) {
                    _this._watcher.destructor();
                }
            })) {
                this._watchersCount++;
            }
            if (!this._watchersCount) {
                return this.target();
            }
            if (!this._watcher) {
                Watch.lock(function () {
                    _this._watcher = new Watch.Watch(function () {
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
            var values = stateValue(this);
            if (!(propertyKey in values)) {
                Watch.lock(function () { return values[propertyKey] = new Computed(get.bind(_this)); });
            }
            return values[propertyKey].value;
        }
    });
}

exports.Computed = Computed;
exports.computed = computed;
exports.default = Computed;
