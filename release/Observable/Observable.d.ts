import { type Observer } from '../types';
export declare class Observable<V> {
    readonly observers: Set<Observer>;
    rawValue: V;
    get value(): V;
}
