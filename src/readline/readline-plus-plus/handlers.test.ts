import { OnDataEvents } from '@g2p/cmder/readline/create-interface/on-input-data'
import {
  HandlerType,
  leftRightHandler,
  promptSpy,
  upDownHandler,
} from '@g2p/cmder/readline/readline-plus-plus/handlers'
import { describe, test, expect, spyOn } from 'bun:test'
import { EventEmitter } from 'stream'

const cases = [
  [OnDataEvents.up_down, 1, 1, upDownHandler(2)],
  [OnDataEvents.up_down, -1, 0, upDownHandler(3)],
  [OnDataEvents.left_right, 1, true, leftRightHandler()],
  [OnDataEvents.left_right, -1, false, leftRightHandler()],
  [OnDataEvents.prompt, true, true, promptSpy()],
  [OnDataEvents.prompt, false, false, promptSpy()],
] as [ev: OnDataEvents, dir: unknown, value: unknown, handler: HandlerType][]

describe('Default event handler to control prompt behavior', () => {
  test.each(cases)('Event %p', (eventName, dir, value, handlerFactory) => {
    const stdin = new EventEmitter()

    const { handler, tick } = handlerFactory(stdin as never)
    const tickSpy = spyOn(tick, 'value')

    stdin.emit(eventName, dir)
    stdin.emit(eventName, dir)
    stdin.emit(eventName, dir)

    expect(handler.value).toBe(value as never)
    expect(tickSpy).toHaveBeenCalled()
  })
})
