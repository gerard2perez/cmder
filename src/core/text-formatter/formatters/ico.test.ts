import { textCompiler } from '@g2p/cmder/text-formatter/text-compiler'
import './ico'

describe('ico', () => {
  test('ico', () => {
    const expected = 'ℹ hello'

    const result = textCompiler`{info|ico} hello`

    expect(result).toBe(expected)
  })

  test('sy', () => {
    const expected = '✔ hello'

    const result = textCompiler`{success|sy} hello`

    expect(result).toBe(expected)
  })
})
