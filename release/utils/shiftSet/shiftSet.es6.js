function shiftSet(set) {
    if (!set.size)
        return undefined;
    const result = set.values().next().value;
    set.delete(result);
    return result;
}

export { shiftSet };
