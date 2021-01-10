import getDecors from '../getDecors/getDecors.es6.js';

/** @deprecated - use `getDecors` instead of this */
function stateValues(target) {
    console.error('The stateValues function will be removed, please use getDecors');
    return getDecors(target);
}

export default stateValues;
export { stateValues };
