import getDecors from '../getDecors/getDecors.es6.js';

function getDecor(target, property) {
    return getDecors(target)[property];
}

export default getDecor;
export { getDecor };
