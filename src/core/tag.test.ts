import { setArgv } from './test-utils'
// must be imported second
import { resetInput } from './input'
import { RegisterParser, SyncTag } from './parser/index'
import numberParser from './parsers/numberParser'
import { tag } from './tag'

describe('tag', () => {
  afterEach(() => {
    resetInput()
  })
  test('string parser', () => {
    setArgv(['--team', 'this is my team'])
    SyncTag('team', 'string', false)
    const team = tag<string>('team', 't', 'this is my team')

    expect(team).toBe('this is my team')
  })

  test('string[] parser', () => {
    setArgv(['--member', 'john', '-m', 'doe'])
    SyncTag('member', 'string', true)
    const members = tag<string[]>('member', 'm', 'name of team member')
    expect(members).toEqual(['john', 'doe'])
  })

  test('number parser', () => {
    setArgv(['--team', 'this is my team', '-a', '20', '-v'])
    // #region module-loader initialization
    RegisterParser('number', numberParser)
    SyncTag('team', 'string', false)
    SyncTag('age', 'number', false)
    // #endregion
    const age = tag<number>('age', 'a', 'age of the team')
    const team = tag<string>('team', 'this is a description')

    expect(age).toBe(20)
    expect(team).toBe('this is my team')
  })

  test('number[] parser', () => {
    setArgv(['--team', 'this is my team', '-a', '20', '--age', '40', '-v'])
    // #region module-loader initialization
    RegisterParser('number', numberParser)
    SyncTag('team', 'string')
    SyncTag('age', 'number', true)
    // #endregion
    const team = tag<string>('team', 'this is a description')
    const ages = tag<number>('age', 'a', 'age of the team')

    expect(team).toBe('this is my team')
    expect(ages).toEqual([20, 40])
  })
})
