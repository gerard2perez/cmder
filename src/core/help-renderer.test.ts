/* eslint-disable @typescript-eslint/no-explicit-any */
import { textCompiler } from '@cmder/text-formatter/text-compiler'
import helpRenderer from './help-renderer'
import { describe, test, expect, spyOn, beforeEach } from 'bun:test'
const olog = console.log
const log = spyOn(console, 'log')
const commandConfig = {
  tag: [
    {
      name: 'name',
      alias: '',
      compact: false,
      multiple: false,
      type: 'string',
      description: 'choose a value',
    },
  ],
  arg: [
    {
      name: 'file',
      multiple: false,
    } as any,
  ],
  command: 'demo',
}
let result = ''
log.mockImplementation(((data: string) => {
  result = data
}) as any)

describe('help-renderer', () => {
  beforeEach(() => {
    result = ''
  })
  test('render the default help', async () => {
    const template = `%app% %command% %arguments%
    This creates a beauty help
    %tags%
`
    const expected = textCompiler`bun demo <{file|green}>
    This creates a beauty help
          {--name      |gray}{choose a value|white}
    {-v|cyan}{, |gray}{--verbose   |gray}
    {-h|cyan}{, |gray}{--help      |gray}
`
    await helpRenderer(template, commandConfig)

    expect(result).toBe(expected)
  })

  test('template receives tags configs', async () => {
    const template = `
    %arguments.file%
    %tags.name%
    %tags.name.tag%
    %tags.name.alias%
    %tags.name.description%
`
    const expected = textCompiler`
    <{file|green}>
          {--name      |gray}{choose a value|white}
    {--name|gray}
    
    {choose a value|white}
`

    await helpRenderer(template, commandConfig)

    expect(result).toBe(expected)
  })
})
