import { Destructor, Watcher } from '../types';
export declare class Watch {
    private readonly watcher;
    destructors: Destructor[];
    private ran;
    constructor(watcher: Watcher, freeParent?: boolean, freeUpdate?: boolean);
    protected run(): any;
    protected watchRun(): void;
    protected forceUpdate(): void;
    /**
     * You can run a watcher even when it's states are not updated.
     * ```typescript
     * const count = new State(0)
     *
     * const watcher = new Watch(() => {
     *   console.log(count.value)
     * })
     * // console.log(0)
     *
     * watcher.update()
     * // console.log(0)
     * ```
     * */
    update(): void;
    /**
     * You can stop watching by `destroy` method of `Watch`.
     * ```javascript
     * const count = new State(0)
     *
     * const watcher = new Watch(() => {
     *   console.log(count.value)
     * })
     * // console.log(0)
     *
     * count.value++
     * // console.log(1)
     *
     * watcher.destroy()
     *
     * count.value++
     * // nothing happens
     * ```
     * */
    destroy(): void;
    onClear(callback: Destructor): this;
    /** @deprecated use onClear */
    onDestroy(callback: Destructor): this;
}
