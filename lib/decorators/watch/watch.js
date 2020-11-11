'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('../../utils/scope/scope.js');
require('../../utils/onClear/onClear.js');
var classes_Watch_Watch = require('../../classes/Watch/Watch.js');

function watch(target, propertyKey, descriptor) {
    return {
        value: function () {
            return new classes_Watch_Watch['default'](descriptor.value.bind(this));
        },
        enumerable: true
    };
}

exports.default = watch;
exports.watch = watch;
