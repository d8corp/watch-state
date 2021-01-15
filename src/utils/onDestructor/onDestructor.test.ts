import {onDestructor, Watch} from '../..'
import onDestructor1 from '.'

describe('onDestructor', () => {
  test('export default', () => {
    expect(onDestructor1).toBe(onDestructor)
  })
  test('returns boolean', () => {
    expect(onDestructor(() => {})).toBe(false)

    let result

    new Watch(() => result = onDestructor(() => {}))

    expect(result).toBe(true)
  })
})
