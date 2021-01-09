import getDecors from '../getDecors/getDecors.es6.js';

/** @deprecated - use getState or getCache or getMixer from @watch-state/mixer */
function getDecor(target, property) {
    return getDecors(target)[property];
}

export default getDecor;
export { getDecor };
