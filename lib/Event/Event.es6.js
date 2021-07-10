import scope from '../scope/scope.es6.js';

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
    forceUpdate() {
        const { activeWatchers } = this;
        this.activeWatchers = this.watchers;
        this.watchers = activeWatchers;
        for (const watcher of this.activeWatchers) {
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

export default Event;
export { Event, globalEvent };
