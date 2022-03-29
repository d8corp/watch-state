'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Event = require('../Event/Event.js');
var constants = require('../constants.js');

class State extends Event.Event {
    constructor(state) {
        super();
        this.state = state;
    }
    /**
     * the field returns current state.
     * ```typescript
     * const state = new State(1)
     * console.log(state.value) // 1
     * ```
     * */
    get value() {
        if (constants.scope.activeWatcher) {
            this.add(constants.scope.activeWatcher);
        }
        return this.state;
    }
    /**
     * Change the state.
     * ```typescript
     * const state = new State(1)
     * console.log(state.value) // 1
     *
     * state.value = 2
     * console.log(state.value) // 2
     * ```
     * */
    set value(value) {
        if (value !== this.state) {
            this.state = value;
            this.update();
        }
    }
}

exports.State = State;
