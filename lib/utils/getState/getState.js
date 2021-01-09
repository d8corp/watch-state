'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils_getDecors_getDecors = require('../getDecors/getDecors.js');

function getState(target, field) {
    return utils_getDecors_getDecors['default'](target)[field];
}

exports.default = getState;
exports.getState = getState;
