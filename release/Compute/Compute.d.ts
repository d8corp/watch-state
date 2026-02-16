import { Observable } from '../Observable';
import type { Destructor, Observer, Watcher } from '../types';
export declare function forceQueueWatchers(): void;
export declare function queueWatchers(observers: Set<Observer>): void;
export declare function invalidateCompute(observer: Observer): void;
/**
 * Cached reactive computation with memoization.
 * Recalculates value only when dependencies change and when it is actively consumed
 * by a Watcher or another Compute that is itself consumed by a Watcher.
 *
 * This ensures that computations are only evaluated when their output is actually needed,
 * enabling efficient lazy evaluation and automatic subscription management.
 *
 * @class Compute
 * @extends Observable<V>
 * @implements {Observer}
 * @template V - computed value type
 *
 * @example
 * const fullName = new State('Mighty Mike')
 * const name = new Compute(() => fullName.value.split(' ')[1])
 *
 * // Only when accessed inside an `Observer`, `Compute` becomes active:
 *
 * const nameWatcher = new Watch(() => console.log(name.value))
 * // Triggers computation and subscribes to `name`
 *
 * // This does NOT trigger recomputation:
 * console.log(name.value)
 *
 * // If used inside another `Compute` that is watched, it triggers:
 * const greeting = new Compute(() => `${name.value} How are you?`)
 *
 * const greetingWatcher new Watch(() => console.log(greeting.value))
 * // Triggers greeting
 *
 * fullName.value = 'Mighty Michael'
 * // Triggers full chain: fullName → name → greeting → greetingWatcher
 *
 * fullName.value = 'Deight Michael'
 * // Triggers part of chain: fullName → name
 */
export declare class Compute<V = unknown> extends Observable<V> implements Observer {
    /** Indicates if computed value is stale and needs recalculation. */
    invalid: boolean;
    /** Tracks if the computation has run at least once. */
    updated: boolean;
    /**
     * Indicates if observer has been destroyed.
     * Prevents accidental use after cleanup.
     */
    destroyed: boolean;
    /** @deprecated Use `observer instanceof Compute` */
    isCache: boolean;
    /** Cleanup functions to run on destroy (e.g., unsubscribes). */
    readonly destructors: Set<Destructor>;
    /** Child watchers created within this watcher's scope */
    readonly childrenObservers: Set<Observer>;
    /** @deprecated Use `childrenObservers` */
    get childWatchers(): Set<Observer>;
    readonly watcher: Watcher<V>;
    constructor(watcher: Watcher<V>, freeParent?: boolean, fireImmediately?: boolean);
    /** Mark computation as invalid and trigger propagation to parent observers. */
    update(): void;
    forceUpdate(): void;
    /**
     * Current value with automatic subscription.
     *
     * Accessing `value` inside an `Observer` automatically subscribes the watcher.
     *
     * @example
     * const count = new State(0)
     * const text = new Compute(() => `Count: ${count.value}`)
     *
     * new Watch(() => console.log(text.value)) // Count: 0
     *
     * count.value++ // Count: 1
     */
    get value(): V;
    /** Stop observation and remove all dependencies. */
    destroy(): void;
}
