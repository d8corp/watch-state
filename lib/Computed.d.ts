import { Watch, State } from '.';
declare class Computed<T = any> {
    target: () => T;
    _value: State<T>;
    _watchersCount: number;
    _watcher: Watch;
    constructor(target: () => T);
    get value(): T;
}
declare function computed(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any>;
export default Computed;
export { Computed, computed, };
