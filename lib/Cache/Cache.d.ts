import { Watch } from '../Watch';
import { Watcher } from '../types';
/**
 * You can cache computed state.
 * The watcher will not be triggered while new result is the same.
 * ```javascript
 * const name = new State('Foo')
 * const surname = new State('Bar')
 *
 * const fullName = new Cache(() => (
 *   `${name.value} ${surname.value[0]}`
 * ))
 *
 * new Watch(() => {
 *   console.log(fullName.value)
 * })
 * // console.log('Foo B')
 *
 * surname.value = 'Baz'
 * // nothing happens
 *
 * surname.value = 'Quux'
 * // console.log('Foo Q')
 * ```
 * */
export declare class Cache<V = any> extends Watch {
    protected updated: boolean;
    private _state;
    constructor(watcher: Watcher<V>, freeParent?: boolean, fireImmediately?: boolean);
    destroy(): void;
    run(): void;
    get hasWatcher(): boolean;
    get size(): number;
    deepUpdate(): void;
    update(): void;
    private get state();
    get value(): V;
    set value(value: V);
}
