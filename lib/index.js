'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Scope = require('./Scope.js');
var Watch = require('./Watch.js');
var Action = require('./Action.js');
require('./stateValue.js');
var State = require('./State.js');
var Computed = require('./Computed.js');



exports.reset = Scope.reset;
exports.scope = Scope['default'];
exports.Watch = Watch.Watch;
exports.default = Watch['default'];
exports.lock = Watch.lock;
exports.onClear = Watch.onClear;
exports.onDestructor = Watch.onDestructor;
exports.onUpdate = Watch.onUpdate;
exports.watch = Watch['default'];
exports.action = Action['default'];
exports.State = State.State;
exports.state = State['default'];
exports.Computed = Computed['default'];
exports.computed = Computed.computed;
