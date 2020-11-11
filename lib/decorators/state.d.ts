import State from '../State';
interface StateValues {
    [key: string]: State;
}
declare function state(target: Object, propertyKey: PropertyKey): void;
export default state;
export { state, StateValues };
