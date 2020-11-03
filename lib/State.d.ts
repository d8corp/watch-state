declare class State<T = any> {
    private _watchers;
    private target;
    constructor(value?: T);
    get value(): T;
    set value(value: T);
    private get watchers();
}
declare function state(target: Object, propertyKey: PropertyKey): void;
export default State;
export { State, state, };
export * from './Watch';
export * from './stateValues';
