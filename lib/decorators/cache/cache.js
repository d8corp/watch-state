'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('../../utils/scope/scope.js');
require('../../utils/createEvent/createEvent.js');
var utils_unwatch_unwatch = require('../../utils/unwatch/unwatch.js');
require('../../utils/onClear/onClear.js');
var utils_getDecors_getDecors = require('../../utils/getDecors/getDecors.js');
require('../../classes/Watch/Watch.js');
require('../../classes/State/State.js');
var classes_Cache_Cache = require('../../classes/Cache/Cache.js');

function cache(target, propertyKey, descriptor) {
    var originalGet = descriptor.get;
    return {
        get: function () {
            var _this = this;
            var values = utils_getDecors_getDecors['default'](this);
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
