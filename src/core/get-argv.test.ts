import { getArgv } from '@g2p/cmder/get-argv'
import { describe, test, expect } from 'bun:test'

describe('get-argv', () => {
  test('load only once the args', () => {
    const expected = getArgv()
    const result = getArgv()

    expect(result).toEqual(expected)
  })
})
