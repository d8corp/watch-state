'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/** Global singleton tracking active watcher and event depth */
const scope = {
    activeWatcher: undefined,
    eventDeep: 0,
};

exports.scope = scope;
