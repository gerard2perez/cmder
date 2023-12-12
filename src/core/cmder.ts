import { arg, tag } from './'
import { SyncArg, SyncTag } from './parser'
import helpRenderer from './help-renderer'
SyncTag('help', 'boolean', false)
SyncArg('string')

const help: boolean = tag('help', 'h', 'Render help') ?? false
const command: string = arg()

export default async function cmder() {
  if (Bun.env.SUB_MODULES && !command && !help) {
    throw new Error(' A command is required')
  }
  const commands = [
    // autodetect files
  ] as string[]

  if (!help && !commands.includes(command)) {
    throw new Error(`A command named '${command}' does not exits`)
  }
  const originalScope = {
    // import hack
  } as Record<string, () => Promise<{ default: () => Promise<void>; content: string; data: CommandMeta; theme: Theme }>>
  const cmd = originalScope[help ? `${command}.hp` : command]

  if (!cmd && help) {
    const helpCommands = Object.keys(originalScope).filter((cmd) => cmd.includes('.hp'))

    for (const helpCommand of helpCommands) {
      const helpContent = await originalScope[helpCommand]()
      helpRenderer(helpContent.content, helpContent.data, helpContent.theme)
    }
  } else if (help) {
    const helpContent = await cmd()
    helpRenderer(helpContent.content, helpContent.data, helpContent.theme)
  } else {
    await (await cmd()).default?.()
  }
}
