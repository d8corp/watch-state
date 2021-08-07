import { Event } from '../Event';
export declare class State<T = any> extends Event {
    state?: T;
    constructor(state?: T);
    /**
     * the field returns current state.
     * ```typescript
     * const state = new State(1)
     * console.log(state.value) // 1
     * ```
     * */
    get value(): T;
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
    set value(value: T);
}
