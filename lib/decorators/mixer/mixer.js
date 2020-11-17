'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('../../utils/scope/scope.js');
require('../../utils/createEvent/createEvent.js');
var utils_unwatch_unwatch = require('../../utils/unwatch/unwatch.js');
var utils_stateValues_stateValues = require('../../utils/stateValues/stateValues.js');
require('../../utils/onClear/onClear.js');
require('../../classes/Watch/Watch.js');
require('../../classes/State/State.js');
var classes_Mixer_Mixer = require('../../classes/Mixer/Mixer.js');

function mixer(target, propertyKey, descriptor) {
    var value = descriptor.value, _a = descriptor.get, originalGet = _a === void 0 ? value : _a;
    return {
        get: function () {
            var _this = this;
            var values = utils_stateValues_stateValues['default'](this);
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
