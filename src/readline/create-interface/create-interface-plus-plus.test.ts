/* eslint-disable @typescript-eslint/no-explicit-any */
import { createInterfacePlusPlus } from '@g2p/cmder/readline/create-interface/create-interface-plus-plus'
import { KEYS } from '@g2p/cmder/readline/create-interface/on-input-data'
import { describe, test, expect, beforeEach } from 'bun:test'
import { Stream } from 'stream'

export class STDIn extends Stream.Readable {
  isTTY = true
  constructor() {
    super()
  }
  write(message: string) {
    this.push(message + '\n')
  }
  _read() {
    return null
  }
}
export class STDOut extends Stream.Writable {
  content = ''
  isFake = true
  isTTY = true
  moveCursor() {}
  clearScreenDown() {
    this.content = ''
  }
  clearLine() {
    const line = this.content.split('\n')
    line[line.length - 1] = ''
    this.content = line.join('\n')
  }
  cursorTo() {
    // this.lines.pop();
    // return this.persist();
  }
  clear() {
    this.content = ''
    // this.persist();
  }
  write(chunck: any) {
    const text: string = chunck
      .toString()
      // eslint-disable-next-line no-control-regex
      .replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')

    this.content += text
    return true
  }
  read() {
    const { content } = this
    this.content = ''
    return content
  }
}
let input = new STDIn()
let output = new STDOut()
const frame = () => 'Hello'

describe('Create Interface Plus Plus', () => {
  beforeEach(() => {
    input = new STDIn()
    output = new STDOut()
  })
  test('Renders initial value when called', async () => {
    createInterfacePlusPlus(input as any, output as any, true, frame)

    expect(output.read()).toBe(' Hello')
  })

  test('Captures a value', async () => {
    const { waitInput } = createInterfacePlusPlus(input as any, output as any, true, frame)

    input.write('world')
    const res = await waitInput()

    expect(res).toBe('world')
  })

  test('Clear input', async () => {
    const { waitInput, pushFrame } = createInterfacePlusPlus(input as any, output as any, true, frame)

    input.write('world')
    const res = await waitInput()
    pushFrame(true)

    expect(res).toBe('world')
    expect(output.read()).toBe('Hello\n')
  })

  test('Throws if user presses ESC', async () => {
    const { waitInput } = createInterfacePlusPlus(input as any, output as any, true, frame)

    input.emit('data', KEYS.CANCEL)

    expect(waitInput()).rejects.toThrow()
  })
})
