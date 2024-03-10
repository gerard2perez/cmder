import logUpdate from 'log-update'
import cliSpinners from 'cli-spinners'
import { textCompiler } from '../text-formatter/text-compiler'
import randomDigits from './tick-compiler/random-digits'
import randomLetter from './tick-compiler/random-letter'
export { ref } from '@g2p/cmder/reactive/ref/ref'

/**
 * You use:
 * {frame} in order to display a spinner
 * {digits:FROM?:TO?} in order to create random digits
 * {letter:LENGTH?} in order to create random letters
 */
export default function spinner(output: () => string) {
  const { interval, frames } = cliSpinners.dots
  let index = 0
  function frame() {
    const frame = frames[index++ % frames.length]
    const content = output()
      .replaceAll('{frame}', frame)
      .replace(/\{digits:?([0-9]+)?:?([0-9]+)?\}/gim, (_, n, m) => {
        return randomDigits(parseInt(n), parseInt(m ?? '0'))
      })
      .replace(/\{letters:?([0-9]+)\}/gim, (_, n) => randomLetter(parseInt(n)))
    logUpdate(textCompiler`${content}`)
  }
  const keepUntil = setInterval(frame, interval)

  return {
    done() {
      clearInterval(keepUntil)
      frame()
      logUpdate.done()
    },
    log(message: string) {
      logUpdate.clear()
      console.log(message)
    },
  }
}
