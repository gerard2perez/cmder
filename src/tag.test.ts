import { setArgv } from './test-utils'
// must be imported second
import { getInput, updateInput } from './input'
import { RegisterParser, SyncTag } from './parser/index'
import numberParser from './parsers/numberParser'
import { tag } from './tag'

describe('tag', () => {
  afterEach(() => {
    updateInput(getInput())
  })
  test('string parser', () => {
    setArgv(['--team', 'this is my team'])
    SyncTag('team', 'string', false)
    const team: string = tag('team', '-t', 'this is my team')

    expect(team).toBe('this is my team')
  })

  test('string[] parser', () => {
    setArgv(['--member', 'john', '-m', 'doe'])
    SyncTag('member', 'string', true)
    const members: string[] = tag('member', '-m', 'name of team member')
    expect(members).toEqual(['john', 'doe'])
  })

  test('number parser', () => {
    setArgv(['--team', 'this is my team', '-a', '20', '-v'])
    // #region module-loader initialization
    RegisterParser('number', numberParser)
    SyncTag('team', 'string', false)
    SyncTag('age', 'number', false)
    // #endregion
    const team: string = tag('team', 't')
    const age: number = tag('age', 'a', 'age of the team')

    expect(team).toBe('this is my team')
    expect(age).toBe(20)
  })

  test('number[] parser', () => {
    setArgv(['--team', 'this is my team', '-a', '20', '--age', '40', '-v'])
    // #region module-loader initialization
    RegisterParser('number', numberParser)
    SyncTag('team', 'string')
    SyncTag('age', 'number', true)
    // #endregion
    const team: string = tag('team', 't')
    const ages: number = tag('age', 'a', 'age of the team')

    expect(team).toBe('this is my team')
    expect(ages).toEqual([20, 40])
  })
})
