const VALUES = Symbol('state values');
function getDecors(target) {
    if (!(VALUES in target)) {
        // @ts-ignore
        target[VALUES] = {};
    }
    return target[VALUES];
}

export default getDecors;
export { getDecors };
