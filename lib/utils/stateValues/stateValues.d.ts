import State from '../../classes/State';
import Cache from '../../classes/Cache';
import Mixer from '../../classes/Mixer';
interface StateOrComputedValues {
    [key: string]: State | Cache | Mixer;
}
declare function stateValues(target: object): StateOrComputedValues;
export default stateValues;
export { stateValues, StateOrComputedValues, };
