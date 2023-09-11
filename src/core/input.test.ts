import { setArgv } from './test-utils'
// must be imported second
import { clearInput, getInput, updateInput } from './input'

describe('input', () => {
  afterEach(() => {
    updateInput(getInput())
  })
  test('transform argv to string', () => {
    const expected = '"arg1" "arg2" -o -t="abc" --opt="this is a test"'
    setArgv(['arg1', 'arg2', '-o', '-t', 'abc', '--opt', 'this is a test'])

    expect(getInput()).toBe(expected)
  })

  test('user input mixed equality tags', () => {
    const expected = '"arg1" "arg2" -o -t="abc" --opt="this is a test"'
    setArgv(['arg1', 'arg2', '-o', '-t=abc', '--opt', 'this is a test'])

    expect(getInput()).toBe(expected)
  })

  test('user input a option with hyphen', () => {
    const expected = '"arg1" "arg2" -o -t="abc" --opt="this-is-a-test"'
    setArgv(['arg1', 'arg2', '-o', '-t=abc', '--opt', 'this-is-a-test'])

    expect(getInput()).toBe(expected)
  })

  test('user input a option with hyphen', () => {
    const expected = '"arg1" "arg2" -o -t="abc" --opt="this-is-a-test"'
    setArgv(['arg1', 'arg2', '-o', '-t=abc', '--opt', 'this-is-a-test'])

    expect(getInput()).toBe(expected)
  })

  test('user input a arg with spaces', () => {
    const expected = '"arg1 arg2" -o -t="abc" --opt="this-is-a-test"'
    setArgv(['arg1 arg2', '-o', '-t=abc', '--opt', 'this-is-a-test'])

    expect(getInput()).toBe(expected)
  })

  describe('tag clearing', () => {
    test('clear multi tag with alias', () => {
      const expected = '"arg1" "arg2" -o'
      setArgv(['arg1', 'arg2', '-o', '-t=abc', '--team', 'this-is-a-test'])
      getInput()
      clearInput({ tag: 'team', alias: 't', multiple: true, parser: (a: string) => a })

      expect(getInput()).toBe(expected)
    })

    test('clear multi tag without alias', () => {
      const expected = '"arg1" "arg2" -o -t="abc"'
      setArgv(['arg1', 'arg2', '-o', '-t=abc', '--team', 'this-is-a-test', '--team', 'this-is-a-test'])
      getInput()
      clearInput({ tag: 'team', multiple: true, parser: (a: string) => a })

      expect(getInput()).toBe(expected)
    })

    test('clear non-multi tag without alias', () => {
      const expected = '"arg1" "arg2" -o -t="abc"'
      setArgv(['arg1', 'arg2', '-o', '-t=abc', '--team', 'this-is-a-test'])
      getInput()
      clearInput({ tag: 'team', multiple: false, parser: (a: string) => a })

      expect(getInput()).toBe(expected)
    })
  })
})
