import State from '../../classes/State';
import Cache from '../../classes/Cache';
interface Types<V = any> {
    state: State<V>;
    cache: Cache<V>;
}
declare type Key = string | number | symbol;
declare type Mapping<K extends Key = Key> = Record<K, keyof Types>;
declare type Target<K extends Key = Key> = Record<K, any>;
declare type Decors<K extends Mapping, T extends Target<keyof K>> = {
    [key in keyof K]: Types<T[key]>[K[key]];
};
declare function getDecors<K extends Mapping, T extends Target>(target: T): Decors<K, T>;
export default getDecors;
export { getDecors, Decors, Target };
