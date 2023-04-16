export function shiftSet (set: Set<any>) {
  if (!set.size) return undefined

  const result = set.values().next().value
  set.delete(result)
  return result
}
