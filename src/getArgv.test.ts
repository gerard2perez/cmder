import { _getArgv } from './getArgv'

describe('getArgv', () => {
  test('load only once the args', () => {
    const expected = _getArgv()
    const result = _getArgv()

    expect(result).toEqual(expected)
  })
})
