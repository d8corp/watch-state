export interface Watcher<R = any> {
    (update?: boolean): R;
}
export interface Destructor<R = any> {
    (): R;
}
export declare class Watch {
    private readonly watcher;
    destructors: Destructor[];
    private ran;
    constructor(watcher: Watcher, freeParent?: boolean, freeUpdate?: boolean);
    protected run(): any;
    protected watchRun(): void;
    protected forceUpdate(): void;
    update(): void;
    destroy(): void;
    onDestroy(callback: Destructor): this;
}
export default Watch;
