'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('../../utils/scope/scope.js');
require('../../utils/createEvent/createEvent.js');
var utils_unwatch_unwatch = require('../../utils/unwatch/unwatch.js');
var utils_getDecors_getDecors = require('../../utils/getDecors/getDecors.js');
require('../../utils/onClear/onClear.js');
require('../../classes/Watch/Watch.js');
require('../../classes/State/State.js');
var classes_Mixer_Mixer = require('../../classes/Mixer/Mixer.js');

/** @deprecated - use @watch-state/mixer */
function mixer(target, propertyKey, descriptor) {
    console.error('The mixer decorator will be removed, please use @watch-state/mixer');
    var value = descriptor.value, _a = descriptor.get, originalGet = _a === void 0 ? value : _a;
    return {
        get: function () {
            var _this = this;
            var values = utils_getDecors_getDecors['default'](this);
            if (!(propertyKey in values)) {
                utils_unwatch_unwatch['default'](function () { return values[propertyKey] = new classes_Mixer_Mixer['default'](originalGet.bind(_this)); });
            }
            return values[propertyKey].value;
        },
        enumerable: true
    };
}

exports.default = mixer;
exports.mixer = mixer;
