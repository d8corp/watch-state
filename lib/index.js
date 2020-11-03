'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Scope = require('./Scope.js');
var Watch = require('./Watch.js');
var Action = require('./Action.js');
var stateValue = require('./stateValue.js');
var State = require('./State.js');
var utils = require('./utils.js');
var Computed = require('./Computed.js');



exports.scope = Scope['default'];
exports.Watch = Watch['default'];
exports.default = Watch.watch;
exports.onClear = Watch.onClear;
exports.onDestructor = Watch.onDestructor;
exports.onUpdate = Watch.onUpdate;
exports.watch = Watch.watch;
exports.action = Action['default'];
exports.stateValues = stateValue['default'];
exports.State = State['default'];
exports.state = State.state;
exports.lock = utils.lock;
exports.reset = utils.reset;
exports.Computed = Computed['default'];
exports.computed = Computed.computed;
