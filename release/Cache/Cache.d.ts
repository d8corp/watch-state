import { Observable } from '../Observable';
import { type Observer, type Watcher } from '../types';
export declare class Cache<V = unknown> extends Observable<V> implements Observer {
    invalid: boolean;
    updated: boolean;
    destroyed: boolean;
    isCache: boolean;
    destructors: Set<Function>;
    childWatchers: Set<Observer>;
    readonly watcher: Watcher<V>;
    constructor(watcher: Watcher<V>, freeParent?: boolean, fireImmediately?: boolean);
    update(): void;
    forceUpdate(): void;
    get value(): V;
    destroy(): void;
}
