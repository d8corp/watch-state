import { scope } from '../constants.es6.js';
import '../helpers/bindObserver/index.es6.js';
import '../helpers/clearWatcher/index.es6.js';
import '../helpers/destroyWatchers/index.es6.js';
import '../helpers/watchWithScope/index.es6.js';
import '../Observable/index.es6.js';
import '../utils/shiftSet/index.es6.js';
import { shiftSet } from '../utils/shiftSet/shiftSet.es6.js';
import { clearWatcher } from '../helpers/clearWatcher/clearWatcher.es6.js';
import { Observable } from '../Observable/Observable.es6.js';
import { bindObserver } from '../helpers/bindObserver/bindObserver.es6.js';
import { watchWithScope } from '../helpers/watchWithScope/watchWithScope.es6.js';
import { destroyWatchers } from '../helpers/destroyWatchers/destroyWatchers.es6.js';

/* queue */
let currentCompute;
let currentObserver;
let forcedQueue;
const computeStack = new Set();
const observersStack = new Set();
function forceQueueWatchers() {
    if (forcedQueue)
        return;
    forcedQueue = true;
    while ((currentCompute = shiftSet(computeStack)) || (currentObserver = shiftSet(observersStack))) {
        if (currentCompute) {
            currentCompute.invalid = true;
            continue;
        }
        clearWatcher(currentObserver);
        currentObserver.update();
    }
    forcedQueue = false;
}
function queueWatchers(observers) {
    const useLoop = !scope.eventDeep && !observersStack.size && !computeStack.size;
    const oldObserversStack = [...observersStack];
    observersStack.clear();
    observers.forEach(watcher => {
        observersStack.add(watcher);
        if (watcher instanceof Compute) {
            computeStack.add(watcher);
        }
    });
    oldObserversStack.forEach(observer => observersStack.add(observer));
    if (useLoop) {
        forceQueueWatchers();
    }
}
/* invalidateCompute */
const invalidateStack = [];
let currentInvalidateObserver;
function invalidateCompute(observer) {
    const skipLoop = invalidateStack.length;
    invalidateStack.push(observer);
    if (skipLoop)
        return;
    while ((currentInvalidateObserver = invalidateStack.shift())) {
        if (currentInvalidateObserver instanceof Compute) {
            invalidateStack.push(...currentInvalidateObserver.observers);
            currentInvalidateObserver.invalid = true;
        }
    }
}
/* Compute */
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
class Compute extends Observable {
    // TODO: remove in major release
    /** @deprecated Use `children` */
    get childrenObservers() {
        return this.children;
    }
    // TODO: remove in major release
    /** @deprecated Use `childrenObservers` */
    get childWatchers() {
        return this.children;
    }
    // TODO: remove in major release
    /** @deprecated Use `reaction` */
    get watcher() {
        return this.reaction;
    }
    constructor(reaction, freeParent, fireImmediately) {
        super();
        this.reaction = reaction;
        /** Indicates if computed value is stale and needs recalculation. */
        this.invalid = true;
        /** Tracks if the computation has run at least once. */
        this.updated = false;
        /**
         * Indicates if observer has been destroyed.
         * Prevents accidental use after cleanup.
         */
        this.destroyed = false;
        // TODO: remove in major release
        /** @deprecated Use `observer instanceof Compute` */
        this.isCache = true;
        /** Cleanup functions to run on destroy (e.g., unsubscribes). */
        this.destructors = new Set();
        /** Child watchers created within this watcher's scope */
        this.children = new Set();
        if (!freeParent) {
            bindObserver(this);
        }
        if (fireImmediately) {
            this.forceUpdate();
        }
    }
    /** Mark computation as invalid and trigger propagation to parent observers. */
    update() {
        invalidateCompute(this);
        const parents = [...this.observers];
        let parent;
        while ((parent = parents.pop())) {
            if (!(parent instanceof Compute)) {
                return this.forceUpdate();
            }
            parents.push(...parent.observers);
        }
    }
    forceUpdate() {
        if (!this.destroyed) {
            this.invalid = false;
            watchWithScope(this, () => {
                const newValue = this.reaction(this.updated); // TODO: remove `this.updated` in major release
                this.updated = true;
                if (newValue !== this.raw) {
                    this.raw = newValue;
                    queueWatchers(this.observers);
                }
            });
        }
    }
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
    get value() {
        if (this.invalid) {
            this.forceUpdate();
        }
        return this.destroyed ? this.raw : super.value;
    }
    /** Stop observation and remove all dependencies. */
    destroy() {
        destroyWatchers(this);
    }
}

export { Compute, forceQueueWatchers, invalidateCompute, queueWatchers };
