'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

let activeWatcher;
class Watch {
    constructor(watcher, freeParent, freeUpdate) {
        this.watcher = watcher;
        this.ran = false;
        if (!freeParent && activeWatcher) {
            activeWatcher.onDestroy(() => this.destroy());
        }
        if (!freeUpdate) {
            this.update();
        }
    }
    static get activeWatcher() {
        return activeWatcher;
    }
    run() {
        const { ran } = this;
        this.ran = true;
        return this.watcher(ran);
    }
    update() {
        this.destroy();
        const prevWatcher = activeWatcher;
        activeWatcher = this;
        this.run();
        activeWatcher = prevWatcher;
        return;
    }
    destroy() {
        const { destructors } = this;
        if (destructors) {
            this.destructors = undefined;
            destructors.forEach(e => e());
        }
        return;
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

exports.Watch = Watch;
exports.default = Watch;
