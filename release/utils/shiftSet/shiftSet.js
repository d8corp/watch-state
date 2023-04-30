'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function shiftSet(set) {
    if (!set.size)
        return undefined;
    const result = set.values().next().value;
    set.delete(result);
    return result;
}

exports.shiftSet = shiftSet;
