'use strict';

var VALUES = Symbol('state values');
function stateValues(target) {
    if (!(VALUES in target)) {
        target[VALUES] = {};
    }
    return target[VALUES];
}

module.exports = stateValues;
