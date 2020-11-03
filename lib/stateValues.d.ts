import Computed, { State } from './Computed';
interface StateValues {
    [key: string]: State | Computed;
}
declare function stateValues(target: object): StateValues;
export default stateValues;
export { stateValues, StateValues, };
