import getDecors from '../getDecors/getDecors.es6.js';

/** @deprecated - use `getDecors` instead of this */
function stateValues(target) {
    return getDecors(target);
}

export default stateValues;
export { stateValues };
