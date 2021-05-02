import {onDestroy, Watch} from '../..'
import onDestructor1 from '.'

describe('onDestructor', () => {
  test('export default', () => {
    expect(onDestructor1).toBe(onDestroy)
  })
  test('returns boolean', () => {
    expect(onDestroy(() => {})).toBe(false)

    let result

    new Watch(() => result = onDestroy(() => {}))

    expect(result).toBe(true)
  })
})
