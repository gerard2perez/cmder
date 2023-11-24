import { RegisterFormatter } from '@cmder/text-formatter/register-formatter'
import { textCompiler } from '@cmder/text-formatter/text-compiler'

describe('textCompiler', () => {
  test('no formatter registered', () => {
    const expectedOutput = '{hello|add-world}'

    const compiled = textCompiler`${expectedOutput}`

    expect(compiled).toBe(expectedOutput)
  })

  test('transform text with formatter', () => {
    RegisterFormatter(function (text: string) {
      return `${text} world!`
    }, 'add-world')

    const input = '{hello|add-world}'
    const expectedOutput = 'hello world!'

    const compiled = textCompiler`${input}`

    expect(compiled).toBe(expectedOutput)
  })

  test('formatter with params', () => {
    RegisterFormatter(function (text: string, a: string, b: string) {
      return `${text} ${a} ${b}`
    }, 'ab')

    const input = '{hello|add-world}'
    const expectedOutput = 'hello world!'

    const compiled = textCompiler`${input}`

    expect(compiled).toBe(expectedOutput)
  })
})
