'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('../Scope.js');
require('../Watch.js');
var State = require('../State.js');
var stateValue = require('../stateValue.js');

function state(target, propertyKey, desc) {
    var value = desc ? (desc.initializer ? desc.initializer() : desc.value) : undefined;
    return {
        get: function () {
            var values = stateValue['default'](this);
            if (!(propertyKey in values)) {
                values[propertyKey] = new State.State(value);
            }
            return values[propertyKey].value;
        },
        set: function (v) {
            var values = stateValue['default'](this);
            if (!(propertyKey in values)) {
                values[propertyKey] = new State.State(v);
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
