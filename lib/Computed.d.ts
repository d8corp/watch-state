import { Watch, State } from './State';
declare class Computed<T = any> {
    target: () => T;
    _value: State<T>;
    _watcher: Watch;
    constructor(target: () => T);
    destructor(): void;
    get value(): T;
}
export default Computed;
export { Computed, };
export * from './State';
