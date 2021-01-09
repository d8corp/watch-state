import getDecors from '../getDecors/getDecors.es6.js';

function getState(target, field) {
    return getDecors(target)[field];
}

export default getState;
export { getState };
