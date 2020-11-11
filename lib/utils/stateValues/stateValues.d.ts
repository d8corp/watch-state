import State from '../../classes/State';
import Cache from '../../classes/Cache';
interface StateOrComputedValues {
    [key: string]: State | Cache;
}
declare function stateValues(target: object): StateOrComputedValues;
export default stateValues;
export { stateValues, StateOrComputedValues, };
