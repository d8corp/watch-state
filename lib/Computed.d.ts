import { Watch, State } from './State';
declare class Computed<T = any> {
    target: () => T;
    _value: State<T>;
    _watcher: Watch;
    constructor(target: () => T);
    destructor(): void;
    get value(): T;
}
declare function computed(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void;
export default Computed;
export { Computed, computed, };
export * from './State';
