import { Observable } from '../Observable';
export declare class State<V = unknown> extends Observable<V> {
    constructor(value?: V);
    get value(): V;
    set value(value: V);
    update(): void;
}
