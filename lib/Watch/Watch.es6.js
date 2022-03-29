import { scope } from '../constants.es6.js';
import { onDestroy } from '../utils/onDestroy/onDestroy.es6.js';

class Watch {
    constructor(watcher, freeParent, freeUpdate) {
        this.watcher = watcher;
        this.ran = false;
        if (!freeParent) {
            onDestroy(() => this.destroy());
        }
        if (!freeUpdate) {
            this.watchRun();
        }
    }
    run() {
        const { ran } = this;
        this.ran = true;
        return this.watcher(ran);
    }
    watchRun() {
        const prevWatcher = scope.activeWatcher;
        scope.activeWatcher = this;
        this.run();
        scope.activeWatcher = prevWatcher;
    }
    forceUpdate() {
        this.destroy();
        this.watchRun();
    }
    /**
     * You can run a watcher even when it's states are not updated.
     * ```typescript
     * const count = new State(0)
     *
     * const watcher = new Watch(() => {
     *   console.log(count.value)
     * })
     * // console.log(0)
     *
     * watcher.update()
     * // console.log(0)
     * ```
     * */
    update() {
        this.destroy();
        if (scope.activeEvent) {
            scope.activeEvent.add(this);
        }
        else {
            this.watchRun();
        }
    }
    /**
     * You can stop watching by `destroy` method of `Watch`.
     * ```javascript
     * const count = new State(0)
     *
     * const watcher = new Watch(() => {
     *   console.log(count.value)
     * })
     * // console.log(0)
     *
     * count.value++
     * // console.log(1)
     *
     * watcher.destroy()
     *
     * count.value++
     * // nothing happens
     * ```
     * */
    destroy() {
        const { destructors } = this;
        if (destructors) {
            this.destructors = undefined;
            destructors.forEach(e => e());
        }
    }
    onClear(callback) {
        if (this.destructors) {
            this.destructors.push(callback);
        }
        else {
            this.destructors = [callback];
        }
        return this;
    }
    /** @deprecated use onClear */
    onDestroy(callback) {
        return this.onClear(callback);
    }
}

export { Watch };
