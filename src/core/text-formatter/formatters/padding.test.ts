import { textCompiler } from '@cmder/text-formatter/text-compiler'
import './padding'

describe('padding', () => {
  test('add padding to left', () => {
    const expected = '...hello'

    const result = textCompiler`{hello|padl:8:.}`

    expect(result).toBe(expected)
  })

  test('add padding to right', () => {
    const expected = 'hello...'

    const result = textCompiler`{hello|padr:8:.}`

    expect(result).toBe(expected)
  })
})
