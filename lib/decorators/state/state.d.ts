import State from '../../classes/State';
interface StateValues {
    [key: string]: State;
}
declare function state(target: Object, propertyKey: string, desc?: any): any;
export default state;
export { state, StateValues };
