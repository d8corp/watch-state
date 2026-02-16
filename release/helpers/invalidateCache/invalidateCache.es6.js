import '../../Compute/index.es6.js';
import { invalidateCompute } from '../../Compute/Compute.es6.js';

/**
 * @deprecated Use `invalidateCompute`
 */
function invalidateCache(observer) {
    invalidateCompute(observer);
}

export { invalidateCache };
