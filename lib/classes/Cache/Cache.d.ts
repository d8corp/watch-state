import Watch from '../Watch';
import State from '../State';
declare class Cache<T = any> {
    target: () => T;
    _value: State<T>;
    _watcher: Watch;
    constructor(target: () => T);
    destructor(): void;
    get value(): T;
}
export default Cache;
export { Cache, };
