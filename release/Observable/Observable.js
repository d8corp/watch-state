'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var constants = require('../constants.js');

class Observable {
    constructor() {
        this.observers = new Set();
    }
    get value() {
        const { activeWatcher } = constants.scope;
        if (activeWatcher) {
            this.observers.add(activeWatcher);
            activeWatcher.destructors.add(() => {
                this.observers.delete(activeWatcher);
            });
        }
        return this.rawValue;
    }
}

exports.Observable = Observable;
