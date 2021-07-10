'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Watch = require('../Watch/Watch.js');
var State = require('../State/State.js');

class Cache extends Watch.Watch {
    constructor(watcher, freeParent, fireImmediately) {
        super(watcher, freeParent, !fireImmediately);
    }
    destroy() {
        return super.destroy();
    }
    run() {
        this.updated = true;
        this.value = super.run();
    }
    get hasWatcher() {
        var _a, _b;
        if (this.updated && ((_b = (_a = this._state) === null || _a === void 0 ? void 0 : _a.watchers) === null || _b === void 0 ? void 0 : _b.size)) {
            for (const watcher of this._state.watchers) {
                if (!(watcher instanceof Cache) || watcher.hasWatcher) {
                    return true;
                }
            }
        }
    }
    deepUpdate() {
        var _a, _b;
        this.updated = false;
        this.destroy();
        if ((_b = (_a = this._state) === null || _a === void 0 ? void 0 : _a.watchers) === null || _b === void 0 ? void 0 : _b.size) {
            for (const watcher of this._state.watchers) {
                watcher.deepUpdate();
            }
        }
    }
    update() {
        if (this.updated) {
            if (this.hasWatcher) {
                this.forceUpdate();
            }
            else {
                this.deepUpdate();
            }
        }
    }
    get state() {
        return this._state || (this._state = new State.State());
    }
    get value() {
        if (!this.updated) {
            this.forceUpdate();
        }
        return this.state.value;
    }
    set value(value) {
        this.state.value = value;
    }
}

exports.Cache = Cache;
exports.default = Cache;
