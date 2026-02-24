export function shiftSet<T> (set: Set<T>) {
  if (!set.size) return undefined

  const result = set.values().next().value as T

  set.delete(result)

  return result
}
