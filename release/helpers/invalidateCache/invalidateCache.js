'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('../../Compute/index.js');
var Compute = require('../../Compute/Compute.js');

/**
 * @deprecated Use `invalidateCompute`
 */
function invalidateCache(observer) {
    Compute.invalidateCompute(observer);
}

exports.invalidateCache = invalidateCache;
