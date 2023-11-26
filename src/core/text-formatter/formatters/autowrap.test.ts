import { textCompiler } from '@g2p/cmder/text-formatter/text-compiler'
import './ico'

describe('auto wrap', () => {
  test('respect a limit of 30 chars', () => {
    const size = process.stdout.getWindowSize()[0] - 30
    const expected = [
      'this  a long text that must be',
      'cut  cleanly  this a long text'.padStart(size + 30, ' '),
      'that must be cut cleanly'.padStart(size + 24, ' '),
    ]

    const result =
      textCompiler`{this a long text that must be cut cleanly this a long text that must be cut cleanly|autowrap:${size}}`.split(
        '\n',
      )
    expect(result).toEqual(expected)
  })
})
