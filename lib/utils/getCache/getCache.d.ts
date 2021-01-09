import Cache from '../../classes/Cache';
import { Target } from '../getDecors';
declare function getCache<T extends Target, F extends keyof T>(target: T, field: F): Cache<T[F]> | undefined;
export default getCache;
export { getCache, };
