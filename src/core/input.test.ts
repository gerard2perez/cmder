import { setArgv } from './test-utils'
// must be imported second
import { clearInput, getInput, updateInput, resetInput } from './input'

describe('input', () => {
  afterEach(() => {
    updateInput(getInput())
    resetInput()
  })
  test('surround args with quotes', () => {
    const expected = '"arg1" "arg2"'
    setArgv(['arg1', 'arg2'])

    expect(getInput()).toBe(expected)
  })

  test('user input a tag with value separated by space', () => {
    const expected = '-t="abc"'
    setArgv(['-t', 'abc'])

    expect(getInput()).toBe(expected)
  })

  test('user input a tag with value joined', () => {
    const expected = '-t="abc"'
    setArgv(['-t=abc'])

    expect(getInput()).toBe(expected)
  })

  test('user input mixed equality tags', () => {
    const expected = '-t="abc" --opt="this is a test" -o'
    setArgv(['-t=abc', '--opt', 'this is a test', '-o'])

    expect(getInput()).toBe(expected)
  })

  test('user input tag long string with hyphens', () => {
    const expected = '"arg1" "arg2" -o -t="abc" --opt="this-is-a-test"'
    setArgv(['arg1', 'arg2', '-o', '-t=abc', '--opt', 'this-is-a-test'])

    expect(getInput()).toBe(expected)
  })

  test('user input tag long string with spaces', () => {
    const expected = '"arg1 arg2" -o -t="abc" --opt="this is a test"'
    setArgv(['arg1 arg2', '-o', '-t=abc', '--opt', 'this is a test'])
    expect(getInput()).toBe(expected)
  })

  describe('tag clearing', () => {
    test('clear multi tag with alias', () => {
      const expected = '"arg1" "arg2" -o'
      setArgv(['arg1', 'arg2', '-o', '-t=abc', '--team', 'this-is-a-test'])
      getInput()

      clearInput({ tag: 'team', compact: false, alias: 't', multiple: true, parser: (a: string) => a })

      expect(getInput()).toBe(expected)
    })

    test('clear multi tag without alias', () => {
      const expected = '"arg1" "arg2" -o -t="abc"'
      setArgv(['arg1', 'arg2', '-o', '-t=abc', '--team', 'this-is-a-test', '--team', 'this-is-a-test'])
      getInput()
      clearInput({ tag: 'team', compact: false, multiple: true, parser: (a: string) => a })

      expect(getInput()).toBe(expected)
    })

    test('clear non-multi tag without alias', () => {
      const expected = '"arg1" "arg2" -o -t="abc"'
      setArgv(['arg1', 'arg2', '-o', '-t=abc', '--team', 'this-is-a-test'])
      getInput()
      clearInput({ tag: 'team', compact: false, multiple: false, parser: (a: string) => a })

      expect(getInput()).toBe(expected)
    })
  })
})
