'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils_getDecors_getDecors = require('../getDecors/getDecors.js');

/** @deprecated - use `getDecors` instead of this */
function stateValues(target) {
    console.error('The stateValues function will be removed, please use getDecors');
    return utils_getDecors_getDecors['default'](target);
}

exports.default = stateValues;
exports.stateValues = stateValues;
