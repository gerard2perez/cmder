import { setArgv } from '@g2p/cmder/get-argv.mock.test'
// must be imported second
import { arg } from './arg'
import { resetInput } from './input'
import { RegisterParser, SyncArg } from './parser/index'
import numberParser from './parsers/numberParser'
import { beforeEach, describe, expect, test } from 'bun:test'
import { mockModule } from '@g2p/cmder/test/mock-module'

await mockModule('@g2p/cmder/get-argv')

describe('arg', () => {
  beforeEach(() => {
    resetInput()
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
