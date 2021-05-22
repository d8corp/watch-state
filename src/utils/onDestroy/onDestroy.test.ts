import {onDestroy, Watch} from '/'

describe('onDestructor', () => {
  test('returns boolean', () => {
    expect(onDestroy(() => {})).toBe(false)

    let result

    new Watch(() => result = onDestroy(() => {}))

    expect(result).toBe(true)
  })
})
