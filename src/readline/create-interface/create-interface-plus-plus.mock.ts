import { mock } from 'bun:test'

export const pushFrame = mock(() => undefined)
export const waitInput = mock(() => Promise.resolve(undefined))
export const frameCompiler = mock(() => '')

mock.module('@g2p/cmder/readline/create-interface/create-interface-plus-plus', () => {
  return {
    createInterfacePlusPlus(input: unknown, output: unknown, hideCursor: unknown, _frameCompiler: unknown) {
      frameCompiler.mockImplementation(_frameCompiler as never)
      return {
        waitInput,
        pushFrame,
      }
    },
  }
})
