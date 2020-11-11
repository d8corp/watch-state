'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('../../utils/scope/scope.js');
var utils_unwatch_unwatch = require('../../utils/unwatch/unwatch.js');
var utils_stateValues_stateValues = require('../../utils/stateValues/stateValues.js');
require('../../utils/onClear/onClear.js');
require('../../classes/Watch/Watch.js');
require('../../classes/State/State.js');
var classes_Cache_Cache = require('../../classes/Cache/Cache.js');

function cache(target, propertyKey, descriptor) {
    var originalGet = descriptor.get;
    return {
        get: function () {
            var _this = this;
            var values = utils_stateValues_stateValues['default'](this);
            if (!(propertyKey in values)) {
                utils_unwatch_unwatch['default'](function () { return values[propertyKey] = new classes_Cache_Cache['default'](originalGet.bind(_this)); });
            }
            return values[propertyKey].value;
        },
        enumerable: true
    };
}

exports.cache = cache;
exports.default = cache;
