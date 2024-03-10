import { OnDataEvents } from '@g2p/cmder/readline/create-interface/on-input-data'
import { mock } from 'bun:test'
import type { EventEmitter } from 'stream'

export const pushFrame = mock(() => undefined)
export const waitInput = mock(() => Promise.resolve(undefined))
export const frameCompiler = mock(() => '')
export const simKeyInput = mock((event: OnDataEvents, value: unknown) => void 0)

mock.module('@g2p/cmder/readline/create-interface/create-interface-plus-plus', () => {
  return {
    createInterfacePlusPlus(input: EventEmitter, output: unknown, hideCursor: unknown, _frameCompiler: unknown) {
      simKeyInput.mockImplementation((event: OnDataEvents, value: unknown) => {
        input.emit(event, value)
      })
      frameCompiler.mockImplementation(_frameCompiler as never)
      return {
        waitInput,
        pushFrame,
      }
    },
  }
})
