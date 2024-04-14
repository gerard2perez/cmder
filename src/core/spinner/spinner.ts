import logUpdate from 'log-update'
import cliSpinners from 'cli-spinners'
import { textCompiler } from '../text-formatter/text-compiler'
import randomDigits from './tick-compiler/random-digits'
import randomLetter from './tick-compiler/random-letter'
import { withContext } from '@g2p/cmder/reactive/computed-context'
export { ref } from '@g2p/cmder/reactive/ref'

/**
 * Usage:
 * {frame} in order to display a spinner
 * {digits:FROM?:TO?} in order to create random digits
 * {letter:LENGTH?} in order to create random letters
 */
export default function spinner(
  spinnerContext: object,
  template: string,
  spinnerKind: cliSpinners.SpinnerName = 'dots',
) {
  const { interval, frames } = cliSpinners[spinnerKind]
  const { frame: preFrame } = withContext(spinnerContext, template)
  let index = 0
  function frame(frameContent?: string) {
    const frame = frames[index++ % frames.length]
    const content = (frameContent || preFrame())
      .replaceAll('{frame}', frame)
      .replace(/\{digits:?([0-9]+)?:?([0-9]+)?\}/gim, (_, n, m) => {
        return randomDigits(parseInt(n), parseInt(m ?? '0'))
      })
      .replace(/\{letters:?([0-9]+)\}/gim, (_, n) => randomLetter(parseInt(n)))
    logUpdate(textCompiler`${content}`)
  }
  const keepUntil = setInterval(frame, interval)

  return {
    done(frameContent?: string) {
      clearInterval(keepUntil)
      frame(frameContent)
      logUpdate.done()
    },
    log(message: string) {
      logUpdate.clear()
      console.log(textCompiler`${message}`)
    },
  }
}
