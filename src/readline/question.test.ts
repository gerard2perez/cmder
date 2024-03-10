import { describe, test, expect } from 'bun:test'
import { waitInput, frameCompiler } from '@g2p/cmder/readline/create-interface/create-interface-plus-plus.mock'
import { question } from '@g2p/cmder/readline/question'
import { textCompiler } from '@g2p/cmder/text-formatter/text-compiler'

describe('Question', () => {
  test('Initial State', () => {
    question('Hello', 'World')
    const frame = frameCompiler()

    expect(frame).toBe(textCompiler`{?|cyan} Hello: {›|gray} {World|gray}`)
  })

  test('Defaulted Stated', async () => {
    waitInput.mockResolvedValue(undefined as never)
    const result = question('Hello', 'World')
    await waitInput()
    await result
    const frame = frameCompiler()

    expect(frame).toBe(textCompiler`{✔|green} Hello: {…|gray} World`)
  })

  test('Prompt input', async () => {
    waitInput.mockResolvedValue('Henry' as never)
    const result = question('Hello', 'World')
    await waitInput()
    await result
    const frame = frameCompiler()

    expect(frame).toBe(textCompiler`{✔|green} Hello: {…|gray} Henry`)
  })

  test('Canceled State', async () => {
    waitInput.mockRejectedValueOnce('Canceled' as never)
    const result = question('Hello', 'World')
    await waitInput()
    expect(result).rejects.toThrow()
    const frame = frameCompiler()

    expect(frame).toBe(textCompiler`{✔|green} Hello: {…|gray} World`)
  })
})
