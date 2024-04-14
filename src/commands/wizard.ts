import { tag } from '@g2p/cmder'
import { question } from '@g2p/cmder/readline/question'
import { QuestionChoice } from '@g2p/cmder/readline/question-choice'
import { wizard } from '@g2p/cmder/terminal/wizard'
import { existsSync } from 'node:fs'

const projectName: string = tag('project-name', 'p', 'The name of the project') ?? ''

enum overrideOptions {
  'Remove existing files and continue' = 'remove',
  'Cancel operation' = 'cancel',
  'Ignore files and continue' = 'ignore',
}

export default async () => {
  const result = await wizard({
    projectName: async () => projectName || question('Project Name', 'name'),
    override: async () => existsSync('./override') && QuestionChoice('Override', { elements: overrideOptions }),
  })
  if (result.override) {
    result.override === overrideOptions['Cancel operation']
    console.log('CASA')
  }

  console.log({ result })
}
