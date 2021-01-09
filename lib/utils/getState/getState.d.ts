import State from '../../classes/State';
import { Target } from '../getDecors';
declare function getState<T extends Target, F extends keyof T>(target: T, field: F): State<T[F]>;
export default getState;
export { getState, };
