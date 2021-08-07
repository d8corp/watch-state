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
        if (!scope.scope.activeEvent) {
            this.activeWatcher = scope.scope.activeWatcher;
            scope.scope.activeWatcher = undefined;
            scope.scope.activeEvent = this;
        }
        scope.scope.activeEventDeep++;
    }
    end() {
        if (!--scope.scope.activeEventDeep && scope.scope.activeEvent === this) {
            scope.scope.activeEvent = undefined;
            this.update();
            scope.scope.activeWatcher = this.activeWatcher;
        }
    }
    forceUpdate() {
        const { watchers } = this;
        this.watchers = undefined;
        for (const watcher of watchers) {
            watcher.update();
        }
    }
    update() {
        var _a;
        if ((_a = this.watchers) === null || _a === void 0 ? void 0 : _a.size) {
            if (this === globalEvent) {
                this.forceUpdate();
            }
            else {
                globalEvent.start();
                this.forceUpdate();
                globalEvent.end();
            }
        }
    }
}
const globalEvent = new Event();

exports.Event = Event;
exports.globalEvent = globalEvent;
