/* eslint-disable @typescript-eslint/no-explicit-any */

import { question } from '@g2p/cmder/readline/question'
import { QuestionChoice } from '@g2p/cmder/readline/question-choice'
import { withContext } from '@g2p/cmder/reactive/computed-context'
import { ref } from '@g2p/cmder/spinner/spinner'
import { textCompiler } from '@g2p/cmder/text-formatter/text-compiler'

export async function wizard(steps: Record<string, () => Promise<unknown>>, config: any) {
  const message = ref('')
  const errorCmp = withContext({ message }, config.onCancel)
  const results = {} as Record<string, unknown>
  for (const [key, ask] of Object.entries(steps)) {
    try {
      results[key] = await ask()
    } catch (ex) {
      message.value = (ex as Error).message
      console.log(textCompiler`${errorCmp.frame()}`)
      break
    }
  }
  return results
}

const overrideOptions = ['Remove existing files and continue', 'Cancel operation', 'Ignore files and continue']
const frameworksOptions = ['Vanilla', 'Vue', 'React', 'Vanilla', 'Vue', 'React', 'Vanilla', 'Vue', 'React'] as const

enum Frameworks {
  Vanilla = 'p',
  Vue = 'a',
}
enum F2 {
  Vanilla,
  Vue,
}

export const WizardExample = () =>
  wizard(
    {
      projectName: () => question('Project Name', 'vite-project'),
      override: async () => {
        const override = await QuestionChoice('Framework', {
          elements: Frameworks,
          // elements: frameworksOptions,
        })
        if (override === Frameworks.Vanilla) {
          // if (override?.includes('Cancel')) {
          throw new Error('Cancel operation')
        }
      },
      // framework: () =>
      //   QuestionChoice('Select a framework', {
      //     elements: frameworksOptions,
      //   }),
    },
    {
      onCancel: `{${'✖'}|red} {message}`,
    },
  )
