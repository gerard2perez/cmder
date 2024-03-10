import { promptSpy } from '@g2p/cmder/readline/readline-plus-plus/handlers'
import { readLinePlusPlus } from '@g2p/cmder/readline/readline-plus-plus/readline-plus-plus'
import { describe, test, expect, beforeEach } from 'bun:test'
import { pushFrame, waitInput } from '@g2p/cmder/readline/create-interface/create-interface-plus-plus.mock'

describe('ReadLine Plus Plus', () => {
  beforeEach(() => {
    waitInput.mockReset()
    pushFrame.mockReset()
  })
  test('Captures a value', async () => {
    // const { createInterfacePlusPlus } = await import('@g2p/cmder/readline/create-interface/create-interface-plus-plus')
    waitInput.mockResolvedValueOnce('gravy' as never)
    const result = await readLinePlusPlus(
      `Hello`,
      { defaults: 'world' },
      {},
      { extractor: ({ result }) => result, handler: promptSpy(), hideCursor: true },
    )

    expect(waitInput).toHaveBeenCalled()
    expect(result).toBe('gravy' as never)
  })

  test('User cancel prompt and error is thrown', async () => {
    // const { createInterfacePlusPlus } = await import('@g2p/cmder/readline/create-interface/create-interface-plus-plus')
    waitInput.mockRejectedValueOnce('Failed' as never)
    const result = readLinePlusPlus(
      `Hello`,
      { defaults: 'world' },
      {},
      { extractor: ({ result }) => result, handler: promptSpy(), hideCursor: true },
    )

    await expect(result).rejects.toThrow()
    expect(pushFrame).toHaveBeenCalledTimes(1)
    expect(pushFrame).toHaveBeenCalledWith(true)
  })
})
