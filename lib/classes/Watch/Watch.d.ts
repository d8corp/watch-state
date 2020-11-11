interface WatchTarget {
    (update?: boolean): any;
}
declare class Watch {
    target: WatchTarget;
    private destructors;
    private cleaners;
    private rendered;
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
