import State from '../../classes/State';
import Cache from '../../classes/Cache';
import Mixed from '../../classes/Mixed';
interface StateOrComputedValues {
    [key: string]: State | Cache | Mixed;
}
declare function stateValues(target: object): StateOrComputedValues;
export default stateValues;
export { stateValues, StateOrComputedValues, };
