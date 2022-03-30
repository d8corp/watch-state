import { scope } from '../constants.es6.js';

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
        target.onClear(() => watchers.delete(target));
    }
    start() {
        if (!scope.activeEvent) {
            this.activeWatcher = scope.activeWatcher;
            scope.activeWatcher = undefined;
            scope.activeEvent = this;
        }
        scope.activeEventDeep++;
    }
    end() {
        if (!--scope.activeEventDeep && scope.activeEvent === this) {
            scope.activeEvent = undefined;
            this.update();
            scope.activeWatcher = this.activeWatcher;
        }
    }
    forceUpdate() {
        const { watchers } = this;
        this.watchers = undefined;
        for (const watcher of watchers) {
            watcher.update();
        }
    }
    /**
     * You can run watchers of a state with `update` method.
     * ```typescript
     * const count = new State(0)
     *
     * new Watch(() => {
     *   console.log(count.value)
     * })
     * // console.log(0)
     *
     * count.update()
     * // console.log(0)
     * ```
     * */
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

export { Event, globalEvent };
