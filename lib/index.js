'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Scope = require('./Scope.js');
var Watch = require('./Watch.js');
var Action = require('./Action.js');
require('./stateValue.js');
var State = require('./State.js');
var Computed = require('./Computed.js');
var utils = require('./utils.js');



exports.scope = Scope['default'];
exports.Watch = Watch['default'];
exports.default = Watch.watch;
exports.onClear = Watch.onClear;
exports.onDestructor = Watch.onDestructor;
exports.onUpdate = Watch.onUpdate;
exports.watch = Watch.watch;
exports.action = Action['default'];
exports.State = State['default'];
exports.state = State.state;
exports.Computed = Computed['default'];
exports.computed = Computed.computed;
exports.lock = utils.lock;
exports.reset = utils.reset;
