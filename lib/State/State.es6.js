import { Watch } from '../Watch/Watch.es6.js';
import { Event } from '../Event/Event.es6.js';

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
        const { activeWatcher } = Watch;
        if (activeWatcher) {
            this.add(activeWatcher);
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

export default State;
export { State };
