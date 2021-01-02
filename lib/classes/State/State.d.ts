import Cache from '../Cache';
import Watch from '../Watch';
export declare class State<T = any> {
    watchers: Set<Watch>;
    caches: Set<Cache>;
    target: T;
    constructor(value?: T);
    getValue(): T;
    setValue(value: T): void;
    get value(): T;
    set value(value: T);
    update(): void;
    updateCache(): Cache<any>[];
}
export default State;
