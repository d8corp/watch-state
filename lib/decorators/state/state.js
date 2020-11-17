'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('../../utils/scope/scope.js');
require('../../utils/createEvent/createEvent.js');
var utils_stateValues_stateValues = require('../../utils/stateValues/stateValues.js');
var classes_State_State = require('../../classes/State/State.js');

function state(target, propertyKey, desc) {
    var value = desc ? (desc.initializer ? desc.initializer() : desc.value) : undefined;
    return {
        get: function () {
            var values = utils_stateValues_stateValues['default'](this);
            if (!(propertyKey in values)) {
                values[propertyKey] = new classes_State_State.State(value);
            }
            return values[propertyKey].value;
        },
        set: function (v) {
            var values = utils_stateValues_stateValues['default'](this);
            if (!(propertyKey in values)) {
                values[propertyKey] = new classes_State_State.State(v);
            }
            else {
                values[propertyKey].value = v;
            }
        },
        enumerable: true
    };
}

exports.default = state;
exports.state = state;
