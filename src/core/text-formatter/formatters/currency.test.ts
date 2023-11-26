import { textCompiler } from '@g2p/cmder/text-formatter/text-compiler'
import './currency'

describe('currency', () => {
  test('formats en-US by default', () => {
    const expected = '$10,000.50'

    const result = textCompiler`{10000.50|currency}`

    expect(result).toBe(expected)
  })

  test('es-MX format', () => {
    const expected = 'MX$10,000.50'

    const result = textCompiler`{10000.50|currency:MXN:en-US}`

    expect(result).toBe(expected)
  })

  test('EUR format', () => {
    const expected = '€12,345.67'

    const result = textCompiler`{12345.67|currency:EUR:en-US}`

    expect(result).toBe(expected)
  })
})
