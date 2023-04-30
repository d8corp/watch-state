'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('../helpers/index.js');
require('../Observable/index.js');
var Observable = require('../Observable/Observable.js');
var queueWatchers = require('../helpers/queueWatchers/queueWatchers.js');

class State extends Observable.Observable {
    constructor(value) {
        super();
        this.rawValue = value;
    }
    get value() {
        return super.value;
    }
    set value(value) {
        if (this.rawValue !== value) {
            this.rawValue = value;
            this.update();
        }
    }
    update() {
        queueWatchers.queueWatchers(this.observers);
    }
}

exports.State = State;
