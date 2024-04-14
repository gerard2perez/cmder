import { type BunPlugin } from 'bun'
import commandsStore, { getCommandName } from './commands-store'
import HPResolver from './hp-resolver'
import CommandResolver from './command-resolver'
const transpiler = new Bun.Transpiler({
  loader: 'ts', // "js | "jsx" | "ts" | "tsx"
})

export const cmderLoader: BunPlugin = {
  target: 'bun',
  name: 'cmder loader',
  async setup(build) {
    const SUB_MODULES = Bun.env.SUB_MODULES ?? ('./src/commands' as string)
    const { readFileSync, readdirSync } = await import('fs')
    if (!(process.argv0 === 'bun' || process.argv0.includes('cmder'))) {
      return
    }
    build.onResolve({ filter: /virtual/ }, (args) => {
      const path = args.path.replace('virtual:', '')
      return {
        path,
        namespace: 'virtual',
      }
    })

    // Detects all command in the project
    build.onLoad({ filter: /cmder.ts/ }, async (args) => {
      let commands = readdirSync(Bun.env.SUB_MODULES ?? ('./src/commands' as string))
        .map((cmd) => cmd.replace('.ts', ''))
        .filter((cmd) => !cmd.includes('.hp'))
      commands = [...commands, ...commands.map((cmd) => `${cmd}.hp`)]
      const code = readFileSync(args.path, 'utf8')
      const injection = `// import hack\n${commands
        .map((cmd) => `['${cmd}']: async () => await import('virtual:${SUB_MODULES}/${cmd}'),`)
        .join('\n')}`
      const injection1 = `// import hack\n'${commands.join("',\n'")}'`
      const added = code.replace('// import hack', injection).replace('// autodetect files', injection1)
      const contents = transpiler.transformSync(added)
      return {
        contents,
        loader: 'ts',
      }
    })

    // injects code syncing tag
    // generates information to build help
    build.onLoad({ filter: /.ts/ }, (args) => {
      let code = readFileSync(args.path, 'utf8')

      if (code.search(/import.*(tag|arg).*from '@g2p\/cmder'/) > -1) {
        const syncs = []
        for (const [, , name, preType, kind, cmdArgs] of code.matchAll(
          /(const|let) *(.*): *(.*) *= *(tag|arg)\((.*)\).*/g,
        )) {
          const [type, multiple] = preType.trim().split('[')
          if (kind === 'tag') {
            syncs.push(`SyncTag('${name}','${type}',${!!multiple})`)
          } else {
            syncs.push(`SyncArg('${type}')`)
          }
          const command = getCommandName(args.path)
          commandsStore[command] = commandsStore[command] ?? {}
          commandsStore[command].command = command
          commandsStore[command][kind] = commandsStore[command][kind] ?? []

          const _args = cmdArgs
            .replaceAll("'", '')
            .split(',')
            .map((arg) => arg.trim())
            .filter((f) => f)

          if ((commandsStore[command][kind] as ParameterMeta[]).find((f) => f.name === name)) {
            continue
          }
          // @ts-expect-error this is a array
          commandsStore[command][kind].push({
            type,
            multiple: !!multiple,
            compact: type === 'boolean',
            name,
            alias: _args.length > 2 ? _args[1] : undefined,
            description: _args[_args.length - 1],
            args: _args,
          })
        }
        code = `
        import { SyncArg, SyncTag } from '@g2p/cmder/parser'
          ${syncs.join('\n')}
          ${code}`
      }
      const result = transpiler.transformSync(code.replaceAll(/(import .*)( with \{.*)(;)?/gm, '$1$3'))
      return {
        contents: result,
        loader: 'ts',
      }
    })

    // loader for .hp (help) files
    build.onLoad({ filter: /.hp$/ }, HPResolver)
    build.onLoad({ filter: /.hp$/, namespace: 'virtual' }, HPResolver)
    build.onLoad({ filter: /.*$/, namespace: 'virtual' }, CommandResolver)
  },
}
