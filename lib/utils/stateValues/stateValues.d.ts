import State from '../../classes/State';
import Cache from '../../classes/Cache';
import Mixer from '../../classes/Mixer';
declare type Key = symbol | string | number;
declare type StateOrComputedValues<K extends Key = Key> = {
    [key in K]: State | Cache | Mixer;
};
/** @deprecated - use `getDecors` instead of this */
declare function stateValues(target: object): StateOrComputedValues;
export default stateValues;
export { stateValues, StateOrComputedValues, };
