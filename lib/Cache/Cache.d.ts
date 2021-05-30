import Watch, { Watcher } from 'src/Watch';
export declare class Cache<V = any> extends Watch {
    private updated;
    private _state;
    constructor(watcher: Watcher, freeParent?: boolean, fireImmediately?: boolean);
    destroy(): void;
    clear(): void;
    run(): void;
    private get state();
    get value(): V;
    set value(value: V);
}
export default Cache;
