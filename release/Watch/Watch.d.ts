import { type Observer } from '../types';
export declare class Watch implements Observer {
    destructors: Set<Function>;
    childWatchers: Set<Observer>;
    destroyed: boolean;
    isCache: boolean;
    readonly watcher: (update: boolean) => void;
    constructor(watcher: (update: boolean) => void, freeParent?: boolean, freeUpdate?: boolean);
    destroy(): void;
    update(): void;
}
