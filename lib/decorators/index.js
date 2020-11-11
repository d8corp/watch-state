'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('../Scope.js');
require('../Watch.js');
require('../State.js');
require('../Computed.js');
require('../stateValue.js');
var decorators_computed = require('./computed.js');
var decorators_state = require('./state.js');



exports.computed = decorators_computed['default'];
exports.state = decorators_state['default'];
