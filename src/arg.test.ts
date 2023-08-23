import { setArgv } from './test-utils'
// must be imported second
import { arg } from './arg'
import { getInput, updateInput } from './input'
import { RegisterParser, SyncArg } from './parser/index'
import numberParser from './parsers/numberParser'

describe('arg', () => {
  afterEach(() => {
    updateInput(getInput())
  })
  test('string parser', () => {
    setArgv(['this is my team', '-v'])
    const team: string = arg()

    expect(team).toBe('this is my team')
  })

  test('number parser', () => {
    setArgv(['this is my team', '20', '-v'])
    // #region module-loader initialization
    RegisterParser('number', numberParser)
    SyncArg('string')
    SyncArg('number')
    // #endregion

    const team: string = arg()
    const age: number = arg()

    expect(team).toBe('this is my team')
    expect(age).toBe(20)
  })
})
