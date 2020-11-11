'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Scope = require('./Scope.js');

function action(target, propertyKey, descriptor) {
    if (descriptor) {
        return {
            value: action(descriptor.value),
            enumerable: true
        };
    }
    else {
        return function () {
            if (Scope['default'].actionWatchers) {
                return target.apply(this, arguments);
            }
            else {
                var watchers = Scope['default'].actionWatchers = new Set();
                var result = target.apply(this, arguments);
                Scope['default'].actionWatchers = undefined;
                watchers.forEach(function (watcher) { return watcher.update(); });
                return result;
            }
        };
    }
}

exports.action = action;
exports.default = action;
