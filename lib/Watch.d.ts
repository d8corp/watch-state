interface WatchTarget {
    (update: boolean): any;
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
declare function watch(target: WatchTarget): Watch;
declare function onDestructor(callback: WatchTarget): boolean;
declare function onClear(callback: WatchTarget): boolean;
declare function unwatch(target: () => any): any;
export default Watch;
export { Watch, onDestructor, onClear, watch, unwatch, };
export * from './Scope';
