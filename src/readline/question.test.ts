import { waitInput, frameCompiler } from '@g2p/cmder/readline/create-interface/create-interface-plus-plus.mock.test'
import { question } from '@g2p/cmder/readline/question'
import { mockModule } from '@g2p/cmder/test/mock-module'
import { textCompiler } from '@g2p/cmder/text-formatter/text-compiler'
import { describe, expect, test } from 'bun:test'

await mockModule('@g2p/cmder/readline/create-interface/create-interface-plus-plus')

describe('Question', async () => {
  test('Initial State', async () => {
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
