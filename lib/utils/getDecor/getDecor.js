'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils_getDecors_getDecors = require('../getDecors/getDecors.js');

function getDecor(target, property) {
    return utils_getDecors_getDecors['default'](target)[property];
}

exports.default = getDecor;
exports.getDecor = getDecor;
