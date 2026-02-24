import { shiftSet } from './shiftSet'

describe('shiftSet', () => {
  test('returns undefined for empty set', () => {
    const s = new Set<number>()
    const res = shiftSet(s)
    expect(res).toBeUndefined()
    expect(s.size).toBe(0)
  })

  test('returns first element and removes it', () => {
    const a = { id: 'a' }
    const b = { id: 'b' }
    const s = new Set<any>([a, b])

    const res = shiftSet(s)
    expect(res).toBe(a)
    expect(s.has(a)).toBe(false)
    expect(s.size).toBe(1)

    const res2 = shiftSet(s)
    expect(res2).toBe(b)
    expect(s.size).toBe(0)
  })
})
