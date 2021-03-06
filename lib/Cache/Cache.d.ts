import Watch, { Watcher } from '../Watch';
export declare class Cache<V = any> extends Watch {
    private updated;
    private _state;
    constructor(watcher: Watcher, freeParent?: boolean, fireImmediately?: boolean);
    destroy(): void;
    run(): void;
    get hasWatcher(): boolean;
    deepUpdate(): void;
    update(): void;
    private get state();
    get value(): V;
    set value(value: V);
}
export default Cache;
