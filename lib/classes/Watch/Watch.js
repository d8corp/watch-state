'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils_scope_scope = require('../../utils/scope/scope.js');
var utils_onClear_onClear = require('../../utils/onClear/onClear.js');

var Watch = /** @class */ (function () {
    function Watch(target) {
        this.target = target;
        this.rendered = false;
        this.update();
    }
    Watch.prototype.update = function () {
        var _this = this;
        this.clear(this.cleaners, this.rendered);
        utils_onClear_onClear['default'](function () { return _this.destructor(); });
        var prevWatcher = utils_scope_scope['default'].activeWatcher;
        utils_scope_scope['default'].activeWatcher = this;
        this.target(this.rendered);
        utils_scope_scope['default'].activeWatcher = prevWatcher;
        this.rendered = true;
        return this;
    };
    Watch.prototype.destructor = function () {
        this.clear(this.destructors, false);
        return this;
    };
    Watch.prototype.clear = function (callbacks, update) {
        if (callbacks) {
            for (var i = 0; i < callbacks.length; i++) {
                callbacks[i](update);
            }
        }
        this.cleaners = undefined;
        this.destructors = undefined;
        return this;
    };
    Watch.prototype.onDestructor = function (callback) {
        if (this.destructors) {
            this.destructors.push(callback);
        }
        else {
            this.destructors = [callback];
        }
        return this;
    };
    Watch.prototype.onUpdate = function (callback) {
        if (this.cleaners) {
            this.cleaners.push(callback);
        }
        else {
            this.cleaners = [callback];
        }
        return this;
    };
    Watch.prototype.onClear = function (callback) {
        this.onUpdate(callback);
        this.onDestructor(callback);
        return this;
    };
    return Watch;
}());

exports.Watch = Watch;
exports.default = Watch;
