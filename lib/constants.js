'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Event = require('./Event/Event.js');

const globalEvent = new Event.Event();
const scope = {
    activeWatcher: undefined,
    activeEvent: undefined,
    activeEventDeep: 0,
};

exports.globalEvent = globalEvent;
exports.scope = scope;
