'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils_getDecors_getDecors = require('../getDecors/getDecors.js');

/** @deprecated - use getState or getCache or getMixer from @watch-state/mixer */
function getDecor(target, property) {
    return utils_getDecors_getDecors['default'](target)[property];
}

exports.default = getDecor;
exports.getDecor = getDecor;
