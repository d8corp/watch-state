export interface Watcher<R = any> {
    (update?: boolean): R;
}
export interface Destructor<R = any> {
    (): R;
}
export declare class Watch {
    private readonly watcher;
    static get activeWatcher(): Watch;
    destructors: Destructor[];
    private ran;
    constructor(watcher: Watcher, freeParent?: boolean, freeUpdate?: boolean);
    protected run(): any;
    update(): void;
    destroy(): void;
    onDestroy(callback: Destructor): this;
}
export default Watch;
