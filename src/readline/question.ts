import { promptSpy } from '@g2p/cmder/readline/readline-plus-plus/handlers'
import { readLinePlusPlus } from '@g2p/cmder/readline/readline-plus-plus/readline-plus-plus'

export async function question<T>(label: string, defaults: T) {
  return readLinePlusPlus(
    `{status} ${label}: {indicator} {placeholder}`,
    {
      defaults: defaults as string,
    },
    {
      placeholder({ handler, defaults, result, ended }) {
        return ended ? result ?? defaults : handler ? '' : `{${defaults}|gray}`
      },
    },
    {
      hideCursor: false,
      handler: promptSpy(),
      extractor: ({ result, defaults }) => (result as T) || defaults,
    },
  )
}
