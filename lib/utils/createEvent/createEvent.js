'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils_scope_scope = require('../scope/scope.js');

function createEvent(target) {
    return function () {
        if (utils_scope_scope['default'].eventWatchers) {
            return target.apply(this, arguments);
        }
        else {
            var activeWatcher = utils_scope_scope['default'].activeWatcher;
            utils_scope_scope['default'].activeWatcher = undefined;
            var watchers = utils_scope_scope['default'].eventWatchers = new Set();
            var result = target.apply(this, arguments);
            utils_scope_scope['default'].eventWatchers = undefined;
            watchers.forEach(function (watcher) { return watcher.update(); });
            utils_scope_scope['default'].activeWatcher = activeWatcher;
            return result;
        }
    };
}

exports.createEvent = createEvent;
exports.default = createEvent;
