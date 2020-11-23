'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils_scope_scope = require('../scope/scope.js');

function createEvent(target) {
    return function () {
        if (utils_scope_scope['default'].activeWatchers) {
            return target.apply(this, arguments);
        }
        else {
            var prevWatcher = utils_scope_scope['default'].activeWatcher;
            utils_scope_scope['default'].activeWatcher = undefined;
            var watchers = utils_scope_scope['default'].activeWatchers = new Set();
            var result = target.apply(this, arguments);
            utils_scope_scope['default'].activeWatchers = undefined;
            watchers.forEach(function (watcher) { return watcher.update(); });
            utils_scope_scope['default'].activeWatcher = prevWatcher;
            return result;
        }
    };
}

exports.createEvent = createEvent;
exports.default = createEvent;
