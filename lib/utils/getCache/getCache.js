'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils_getDecors_getDecors = require('../getDecors/getDecors.js');

function getCache(target, field) {
    return utils_getDecors_getDecors['default'](target)[field];
}

exports.default = getCache;
exports.getCache = getCache;
