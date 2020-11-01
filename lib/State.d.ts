declare class State<T = any> {
    private target?;
    private watchers;
    constructor(target?: T);
    get value(): T;
    set value(value: T);
}
declare function state(target: Object, propertyKey: PropertyKey): void;
export default State;
export { State, state, };
export * from './Watch';
export * from './stateValues';
