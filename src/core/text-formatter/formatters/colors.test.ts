import { textCompiler } from '@cmder/text-formatter/text-compiler'
import './colors'

describe('chalk formater', () => {
  test('turn red', () => {
    const expected = '\u001B[31mred\u001B[39m'

    const result = textCompiler`{red|red}`

    expect(result).toBe(expected)
  })
  test('custom color', () => {
    const expected = '\u001B[38;2;155;30;85mred\u001B[39m'

    const result = textCompiler`{red|rgb:155:30:85}`

    expect(result).toBe(expected)
  })
})
