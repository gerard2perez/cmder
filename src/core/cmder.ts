import { arg, tag } from '@cmder'
import { SyncArg, SyncTag } from '@cmder/parser'
import renderHelp from '@cmder/renderHelp'
SyncArg('string')
SyncTag('help', 'boolean', false)
const command: string = arg()
const help: boolean = tag('help', 'h', 'Render help') ?? false

export default async function cmder() {
  if (Bun.env.SUB_MODULES && !command && !help) {
    throw new Error(' A command is required')
  }
  const moduleCommand = `../commands/${command}.ts`
  const isCompiled = import.meta.url.includes('compiled')
  const commands = [
    // autodetect files
  ] as string[]

  if (!commands.includes(command)) {
    throw new Error(`A command named '${command}' does not exits`)
  }

  if (!(process.env.NODE_ENV === 'production' && isCompiled)) {
    //Local dev
    await import(moduleCommand)
  }
  const originalScope = {
    // import hack
  } as Record<string, () => Promise<{ default: () => Promise<void>; content: string; data: CommandMeta }>>
  const cmd = originalScope[help ? `${command}.hp` : command]

  if (help) {
    const helpContent = await cmd()
    renderHelp(helpContent.content, command, helpContent.data)
    return
  }
  await (await cmd()).default?.()
}
