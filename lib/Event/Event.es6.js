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
    start() {
        if (!activeEvent) {
            activeEvent = this;
            const { activeWatchers } = this;
            this.activeWatchers = this.watchers;
            this.watchers = activeWatchers;
            this.activeWatcher = Watch.activeWatcher;
            Watch.activeWatcher = undefined;
        }
    }
    end() {
        var _a;
        if (activeEvent === this) {
            if (this.activeWatchers) {
                Watch.activeWatcher = this.activeWatcher;
                activeEvent = undefined;
                for (const watcher of this.activeWatchers) {
                    // @ts-ignore
                    (_a = watcher.clear) === null || _a === void 0 ? void 0 : _a.call(watcher);
                }
                for (const watcher of this.activeWatchers) {
                    watcher.update();
                }
            }
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

export default Event;
export { Event };
