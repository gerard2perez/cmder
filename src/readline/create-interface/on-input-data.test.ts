import { KEYS, OnDataEvents, onData } from '@g2p/cmder/readline/create-interface/on-input-data'
import { describe, test, mock, expect } from 'bun:test'
import { EventEmitter } from 'stream'

const cases = [
  [OnDataEvents.up_down, KEYS.UP, -1],
  [OnDataEvents.up_down, KEYS.DOWN, 1],
  [OnDataEvents.left_right, KEYS.LEFT, -1],
  [OnDataEvents.left_right, KEYS.RIGHT, 1],
  [OnDataEvents.cancel, KEYS.CANCEL, undefined],
  [OnDataEvents.cancel, KEYS.SIGINT, undefined],
  [OnDataEvents.prompt, Buffer.from('a'), true],
] as [ev: OnDataEvents, key: Buffer, value: unknown][]

describe('Custom event for readline manipulation', () => {
  test.each(cases)('Event %p', (eventName, key, value) => {
    const stdin = new EventEmitter()
    const spy = mock((e) => e)
    stdin.on('data', onData)
    stdin.on(eventName, spy)
    stdin.emit('data', { input: stdin, rl: { line: 'ss' } }, key)

    expect(spy).toHaveBeenCalled()
    if (value) {
      expect(spy).toHaveBeenLastCalledWith(value)
    }
  })
})
