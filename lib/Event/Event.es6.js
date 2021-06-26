import { Watch } from '../Watch/Watch.es6.js';

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
    _start() {
        if (!activeEvent) {
            activeEvent = this;
            const { activeWatchers } = this;
            this.activeWatchers = this.watchers;
            this.watchers = activeWatchers;
        }
    }
    start() {
        this._start();
        this.activeWatcher = Watch.activeWatcher;
        Watch.activeWatcher = undefined;
    }
    _end() {
        var _a;
        if (activeEvent === this) {
            if (this.activeWatchers) {
                for (const watcher of this.activeWatchers) {
                    // @ts-ignore
                    (_a = watcher.clear) === null || _a === void 0 ? void 0 : _a.call(watcher);
                }
                for (const watcher of this.activeWatchers) {
                    watcher.update();
                }
            }
            activeEvent = undefined;
        }
    }
    end() {
        Watch.activeWatcher = this.activeWatcher;
        this._end();
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
            this._start();
            this._end();
        }
    }
}

export default Event;
export { Event };
