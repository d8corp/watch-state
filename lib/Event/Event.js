'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Cache = require('../Cache/Cache.js');

let activeEvent;
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
        if (!activeEvent) {
            activeEvent = this;
            const { activeWatchers } = this;
            this.activeWatchers = this.watchers;
            this.watchers = activeWatchers;
        }
    }
    end() {
        if (activeEvent === this) {
            for (const watcher of this.activeWatchers) {
                if (watcher instanceof Cache.Cache) {
                    watcher.clear();
                }
            }
            for (const watcher of this.activeWatchers) {
                watcher.update();
            }
            activeEvent = undefined;
        }
    }
    pipe(watcher) {
        if (this.activeWatchers) {
            this.activeWatchers.add(watcher);
            watcher.onDestroy(() => this.activeWatchers.delete(watcher));
        }
        else {
            this.activeWatchers = new Set([watcher]);
        }
    }
    update() {
        var _a;
        if (!((_a = this.watchers) === null || _a === void 0 ? void 0 : _a.size)) {
            return;
        }
        if (activeEvent) {
            for (const target of this.watchers) {
                activeEvent.pipe(target);
            }
        }
        else {
            this.start();
            this.end();
        }
    }
}

exports.Event = Event;
exports.default = Event;
