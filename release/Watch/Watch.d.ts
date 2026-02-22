import type { Destructor, Observer, Reaction, Watcher } from '../types';
/**
 * Watcher class for reactive state tracking.
 * Executes callback function when observed states change.
 * @class Watch
 * @implements {Observer}
 *
 * @example
 * // Create state
 * const count = new State(0)
 *
 * // Create watcher that logs the state changes
 * new Watch(() => console.log(count.value)) // auto-subscribes to count
 *
 * count.value = 1 // triggers watcher callback
 */
export declare class Watch implements Observer {
    readonly reaction: Watcher<void> | Reaction<void>;
    /** Whether the watcher has been destroyed */
    destroyed: boolean;
    /** Tracks if the computation has run at least once. */
    updated: boolean;
    /** Cleanup functions to run when watcher is destroyed */
    readonly destructors: Set<Destructor>;
    /** Child observers created within this watcher's scope */
    readonly children: Set<Observer>;
    /** @deprecated Use `children` */
    get childrenObservers(): Set<Observer>;
    /** @deprecated Use `childrenObservers` */
    get childWatchers(): Set<Observer>;
    /** @deprecated Use `reaction` */
    get watcher(): Watcher<void> | Reaction<void>;
    constructor(reaction: Reaction<void>, freeParent?: boolean, freeUpdate?: boolean);
    /** @deprecated `update` argument is deprecated, use `Reaction` */
    constructor(reaction: Watcher<void>, freeParent?: boolean, freeUpdate?: boolean);
    /** Destroy watcher and cleanup all dependencies */
    destroy(): void;
    /** Force watcher update regardless of state changes */
    update(): void;
}
