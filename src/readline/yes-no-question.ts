import { leftRightHandler } from '@g2p/cmder/readline/readline-plus-plus/handlers'
import { readLinePlusPlus } from '@g2p/cmder/readline/readline-plus-plus/readline-plus-plus'

export function yesNoQuestion(label: string) {
  return readLinePlusPlus(
    `{status} ${label}: {indicator} {placeholder}`,
    {
      defaults: '',
    },
    {
      placeholder({ handler }) {
        return handler ? 'No {/|gray} {Yes|cyan|underline}' : `{No|cyan|underline} {/|gray} {Yes}`
      },
    },
    {
      hideCursor: true,
      handler: leftRightHandler(),
      extractor: ({ handler }) => handler,
    },
  )
}
