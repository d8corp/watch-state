declare class State<T = any> {
    target?: T;
    private watchers;
    constructor(target?: T);
    get value(): T;
    set value(value: T);
}
declare function state(target: Object, propertyKey: PropertyKey): void;
export default state;
export { State, state, };
