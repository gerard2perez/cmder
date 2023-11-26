import { textCompiler } from '@g2p/cmder/text-formatter/text-compiler'
import './highlight-basename'

describe('highlightBasename', () => {
  test('highlights only the filename', () => {
    const expected = '\u001B[37mhello/\u001B[39m\u001B[1m\u001B[31mworld.ts\u001B[39m\u001B[22m'

    const result = textCompiler`{hello/world.ts|highlightBasename:red:white}`

    expect(result).toBe(expected)
  })
})
