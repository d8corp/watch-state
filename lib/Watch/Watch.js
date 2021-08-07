'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var scope = require('../scope/scope.js');

class Watch {
    constructor(watcher, freeParent, freeUpdate) {
        this.watcher = watcher;
        this.ran = false;
        if (!freeParent && scope.scope.activeWatcher) {
            scope.scope.activeWatcher.onDestroy(() => this.destroy());
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
        const prevWatcher = scope.scope.activeWatcher;
        scope.scope.activeWatcher = this;
        this.run();
        scope.scope.activeWatcher = prevWatcher;
    }
    forceUpdate() {
        this.destroy();
        this.watchRun();
    }
    update() {
        this.destroy();
        if (scope.scope.activeEvent) {
            scope.scope.activeEvent.add(this);
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

exports.Watch = Watch;
