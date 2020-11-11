import Computed, { State } from './Computed';
interface StateOrComputedValues {
    [key: string]: State | Computed;
}
declare function stateValues(target: object): StateOrComputedValues;
export default stateValues;
export { stateValues, StateOrComputedValues, };
