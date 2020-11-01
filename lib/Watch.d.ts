interface WatchTarget {
    (update: boolean): any;
}
declare class Watch {
    target: WatchTarget;
    private destructors;
    private cleaners;
    private rendered;
    constructor(target: WatchTarget);
    update(): void;
    destructor(): void;
    private clear;
    onDestructor(callback: WatchTarget): void;
    onUpdate(callback: WatchTarget): void;
    onClear(callback: WatchTarget): void;
}
declare function watch(target: WatchTarget): Watch;
declare function onDestructor(callback: WatchTarget): boolean;
declare function onUpdate(callback: WatchTarget): boolean;
declare function onClear(callback: WatchTarget): boolean;
declare function lock(target: any): any;
export default watch;
export { Watch, onDestructor, onUpdate, onClear, lock, watch, };
