'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var scope = require('../scope/scope.js');

class Event {
    add(target) {
        let { watchers } = this;
        if (watchers) {
            if (watchers.has(target)) {
                return;
            }
            watchers.add(target);
        }
        else {
            watchers = this.watchers = new Set([target]);
        }
        target.onDestroy(() => watchers.delete(target));
    }
    start() {
        if (!scope.activeEvent) {
            this.activeWatcher = scope.activeWatcher;
            scope.activeWatcher = undefined;
            scope.activeEvent = this;
        }
    }
    end() {
        if (scope.activeEvent === this) {
            scope.activeEvent = undefined;
            this.update();
            scope.activeWatcher = this.activeWatcher;
        }
    }
    update() {
        var _a;
        if ((_a = this.watchers) === null || _a === void 0 ? void 0 : _a.size) {
            const { activeWatchers } = this;
            this.activeWatchers = this.watchers;
            this.watchers = activeWatchers;
            for (const watcher of this.activeWatchers) {
                if (this.activeWatchers.size) {
                    watcher.update();
                }
            }
        }
    }
}

exports.Event = Event;
exports.default = Event;
