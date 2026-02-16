/** Cleanup function called on observer destruction. */
export type Destructor = () => void;
/** Interface defining the contract for reactive observers. */
export interface Observer {
    /**
     * Child observers created within this observer's scope.
     * Used for hierarchical cleanup.
     */
    childrenObservers: Set<Observer>;
    /** Cleanup functions to run on destroy (e.g., unsubscribes). */
    destructors: Set<Destructor>;
    /** Stop observation and remove all dependencies. */
    destroy: () => void;
    /** Force re-run of the observer's logic. */
    update: () => void;
    /**
     * Indicates if observer has been destroyed.
     * Prevents accidental use after cleanup.
     */
    destroyed: boolean;
    /** @deprecated Use `childrenObservers` */
    childWatchers: Set<Observer>;
    /** @deprecated Use `observer instanceof Compute` */
    isCache?: boolean;
}
/** Global singleton tracking active watcher and event depth */
export interface Scope {
    /** Currently executing watcher (for auto-subscription) */
    activeWatcher?: Observer;
    /** Current nesting depth of events */
    eventDeep: number;
}
/** Watcher callback signature. First call: `update=false`, updates: `update=true`. */
export type Watcher<T> = (update: boolean) => T;
