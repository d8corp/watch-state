import { State } from '.';
import Computed from './Computed';
interface StateValues {
    [key: string]: State | Computed;
}
declare function stateValues(target: object): StateValues;
export default stateValues;
export { StateValues };
