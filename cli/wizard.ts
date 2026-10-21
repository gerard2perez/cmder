import { tag } from '../lib/core'
import { question } from '../lib/core/readline/question'
import { QuestionChoice } from '../lib/core/readline/question-choice'
import { wizard } from '../lib/core/terminal/wizard'
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
