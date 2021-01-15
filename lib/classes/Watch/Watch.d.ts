interface WatchTarget<R = any> {
    (update?: boolean): R;
}
declare class Watch {
    private readonly target;
    private destructors;
    private cleaners;
    private rendered;
    updating: boolean;
    constructor(target: WatchTarget);
    update(): this;
    destructor(): this;
    private clear;
    onDestructor(callback: WatchTarget): this;
    onUpdate(callback: WatchTarget): this;
    onClear(callback: WatchTarget): this;
}
export default Watch;
export { Watch, WatchTarget, };
