import { Event } from '../Event/Event.es6.js';
import { scope } from '../constants.es6.js';

class State extends Event {
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
        if (scope.activeWatcher) {
            this.add(scope.activeWatcher);
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

export { State };
