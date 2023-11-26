import { arg, tag } from './'
import { SyncArg, SyncTag } from './parser'
import helpRenderer from './help-renderer'
SyncArg('string')
SyncTag('help', 'boolean', false)
const command: string = arg()
const help: boolean = tag('help', 'h', 'Render help') ?? false

export default async function cmder() {
  if (Bun.env.SUB_MODULES && !command && !help) {
    throw new Error(' A command is required')
  }
  const commands = [
    // autodetect files
  ] as string[]
  if (!commands.includes(command)) {
    throw new Error(`A command named '${command}' does not exits`)
  }
  const originalScope = {
    // import hack
  } as Record<string, () => Promise<{ default: () => Promise<void>; content: string; data: CommandMeta; theme: Theme }>>
  const cmd = originalScope[help ? `${command}.hp` : command]

  if (help) {
    const helpContent = await cmd()
    helpRenderer(helpContent.content, helpContent.data, helpContent.theme)
    return
  }
  await (await cmd()).default?.()
}
