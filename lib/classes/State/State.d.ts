import Cache from '../Cache';
import Watch from '../Watch';
export declare class State<T = any> {
    watchers: Set<Watch>;
    caches: Set<Cache>;
    target: T;
    constructor(value?: T);
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
    /**
     * Update all watchers of the state.
     * ```typescript
     * const state = new State(1)
     * new Watch(() => console.log(state.value))
     * // 1
     * state.update()
     * // 1
     * ```
     * */
    update(): void;
}
export default State;
