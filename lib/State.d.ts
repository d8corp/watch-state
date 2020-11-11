import { Watch } from './Watch';
export declare class State<T = any> {
    private _watchers;
    private target;
    constructor(value?: T);
    get value(): T;
    set value(value: T);
    update(): void;
    get watchers(): Set<Watch>;
}
export default State;
export * from './Watch';
