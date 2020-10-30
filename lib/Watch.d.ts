interface WatchTarget {
    (update: boolean): any;
}
interface DestructorOrCleaner {
    (): any;
}
declare class Watch {
    target: WatchTarget;
    private destructors;
    private cleaners;
    rendered: true;
    constructor(target: WatchTarget);
    update(): void;
    destructor(): void;
    private clear;
    onDestructor(callback: DestructorOrCleaner): void;
    onUpdate(callback: DestructorOrCleaner): void;
    onClear(callback: DestructorOrCleaner): void;
}
declare function watch(target: WatchTarget): Watch;
declare function onDestructor(callback: DestructorOrCleaner): boolean;
declare function onUpdate(callback: DestructorOrCleaner): boolean;
declare function onClear(callback: DestructorOrCleaner): boolean;
declare function lock(target: any): any;
export default watch;
export { Watch, onDestructor, onUpdate, onClear, lock, watch, };
