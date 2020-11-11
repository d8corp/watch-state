'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Scope = require('./Scope.js');
var Watch = require('./Watch.js');
var Action = require('./Action.js');
var State = require('./State.js');
var Computed = require('./Computed.js');
var utils = require('./utils.js');
require('./stateValue.js');
var decorators_computed = require('./decorators/computed.js');
var decorators_state = require('./decorators/state.js');



exports.scope = Scope['default'];
exports.Watch = Watch['default'];
exports.default = Watch.watch;
exports.onClear = Watch.onClear;
exports.onDestructor = Watch.onDestructor;
exports.unwatch = Watch.unwatch;
exports.watch = Watch.watch;
exports.action = Action['default'];
exports.State = State.State;
exports.Computed = Computed['default'];
exports.reset = utils.reset;
exports.computed = decorators_computed['default'];
exports.state = decorators_state['default'];
