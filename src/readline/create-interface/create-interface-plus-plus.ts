import { onData } from '@g2p/cmder/readline/create-interface/on-input-data'
import readline from 'node:readline/promises'
import type { ReadStream, WriteStream } from 'node:tty'
/**
 * Add support to show/hide cursor and use question with a template
 * Allow to throw error when ESC key is used and auto clean template on end
 */
export function createInterfacePlusPlus(
  input: ReadStream,
  output: WriteStream,
  hideCursor: boolean,
  frameCompiler: () => string,
) {
  const abort = new AbortController()
  hideCursor && output.write('\u001B[?25l')
  const rl = readline.createInterface(input, output)
  const originalY = rl.getCursorPos().rows
  let finalY = 0

  const waitForInput = rl.question('', { signal: abort.signal }).catch(() => null) as Promise<string | null | undefined>

  waitForInput.then((result) => {
    hideCursor && output.write('\u001B[?25h')
    return result
  })
  /**
   * When passed true frees all the resources and clears the template
   */
  function pushFrame(clearLines = false) {
    if (clearLines) {
      output.moveCursor(-output.columns, originalY - finalY - 1)
      output.clearScreenDown()
    }
    rl.setPrompt(frameCompiler())
    rl.prompt(true)
    if (clearLines) {
      output.write('\n')
      rl.close()
    }
  }
  const on_data = onData.bind(null, { input, rl })
  input.on('data', on_data)
  input.once('cancel', () => abort.abort())
  rl.on('SIGINT', () => undefined)
  // input.on('SIGINT', () => console.log('SIGINT'))
  rl.once('close', () => {
    input.removeListener('data', on_data)
    input.removeAllListeners('up_down')
    input.removeAllListeners('left_right')
    input.removeAllListeners('cancel')
    input.removeAllListeners('prompt')
  })
  /**
   * @throws {Error} Operation cancelled
   */
  async function waitInput() {
    const result = await waitForInput
    if (result === null) {
      throw new Error('Operation cancelled')
    }
    return result
  }
  pushFrame()
  finalY = rl.getCursorPos().rows
  return { waitInput, pushFrame }
}
