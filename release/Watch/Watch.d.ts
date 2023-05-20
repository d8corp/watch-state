import { type Observer, type Watcher } from '../types';
export declare class Watch implements Observer {
    destructors: Set<Function>;
    childWatchers: Set<Observer>;
    destroyed: boolean;
    isCache: boolean;
    readonly watcher: Watcher<void>;
    constructor(watcher: Watcher<void>, freeParent?: boolean, freeUpdate?: boolean);
    destroy(): void;
    update(): void;
}
