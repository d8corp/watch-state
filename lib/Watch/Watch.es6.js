import { scope } from '../scope/scope.es6.js';

class Watch {
    constructor(watcher, freeParent, freeUpdate) {
        this.watcher = watcher;
        this.ran = false;
        if (!freeParent && scope.activeWatcher) {
            scope.activeWatcher.onDestroy(() => this.destroy());
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
    update() {
        this.destroy();
        if (scope.activeEvent) {
            scope.activeEvent.add(this);
        }
        else {
            this.watchRun();
        }
    }
    destroy() {
        const { destructors } = this;
        if (destructors) {
            this.destructors = undefined;
            destructors.forEach(e => e());
        }
    }
    onDestroy(callback) {
        if (this.destructors) {
            this.destructors.push(callback);
        }
        else {
            this.destructors = [callback];
        }
        return this;
    }
}

export { Watch };
