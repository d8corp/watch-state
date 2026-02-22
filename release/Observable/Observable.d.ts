import { type Observer } from '../types';
/**
 * Base reactive value **requiring subclasses to implement `update()`** for watcher notifications.
 *
 * Provides automatic observer tracking when `value` is accessed in `Observer` (`State`, `Compute`).
 *
 * @class Observable
 * @template V - state value type
 */
export declare abstract class Observable<V> {
    /** Set of registered observers */
    readonly observers: Set<Observer>;
    /** Raw value. No auto-subscription on direct access (unlike `value`). */
    abstract raw: V;
    /** @deprecated Use raw field */
    get rawValue(): V;
    /** @deprecated Use raw field */
    set rawValue(raw: V);
    /**
     * Current value with automatic subscription.
     *
     * Accessing `value` inside an `Observer` automatically subscribes the watcher.
     *
     * @example
     * new Watch(() => console.log(state.value)) // auto-subscribes
     */
    get value(): V;
    /** Must be implemented by subclasses to notify watchers */
    abstract update(): void;
}
