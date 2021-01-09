import getDecors from '../getDecors/getDecors.es6.js';

function getCache(target, field) {
    return getDecors(target)[field];
}

export default getCache;
export { getCache };
