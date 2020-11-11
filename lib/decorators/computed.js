'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('../Scope.js');
var Watch = require('../Watch.js');
require('../State.js');
var Computed = require('../Computed.js');
var stateValue = require('../stateValue.js');

function computed(target, propertyKey, descriptor) {
    var originalGet = descriptor.get;
    return {
        get: function () {
            var _this = this;
            var values = stateValue['default'](this);
            if (!(propertyKey in values)) {
                Watch.unwatch(function () { return values[propertyKey] = new Computed['default'](originalGet.bind(_this)); });
            }
            return values[propertyKey].value;
        },
        enumerable: true
    };
}

exports.computed = computed;
exports.default = computed;
