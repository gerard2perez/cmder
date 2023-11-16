import type { BunPlugin } from 'bun'
import { basename } from 'path'
const transpiler = new Bun.Transpiler({
  loader: 'ts', // "js | "jsx" | "ts" | "tsx"
})
function getCommandName(urlpath: string) {
  return basename(urlpath).replace('.hp', '').replace('.ts', '')
}
const commands = {} as Record<string, Record<string, object[] | string>>
export const cmderLoader: BunPlugin = {
  target: 'bun',
  name: 'cmder loader',
  async setup(build) {
    if (process.argv0 !== 'bun') {
      return
    }
    const { readFileSync, readdirSync } = await import('fs')
    build.onLoad({ filter: /cmder.ts/ }, (args) => {
      const commands = readdirSync(Bun.env.SUB_MODULES as string).map((cmd) => cmd.replace('.ts', ''))
      const code = readFileSync(args.path, 'utf8')
      const injection = `// import hack\n${commands
        .map((cmd) => `['${cmd}']: async () => await import('../commands/${cmd}'),`)
        .join('\n')}`
      const injection1 = `// import hack\n'${commands.join("',\n'")}'`
      const added = code.replace('// import hack', injection).replace('// autodetect files', injection1)
      const contents = transpiler.transformSync(added)
      return {
        contents,
        loader: 'ts',
      }
    })

    build.onLoad({ filter: /.ts/ }, (args) => {
      let code = readFileSync(args.path, 'utf8')

      if (code.search(/import.*(tag|arg).*from '@cmder'/) > -1) {
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
          commands[command] = commands[command] ?? {}
          commands[command].command = command
          commands[command][kind] = commands[command][kind] ?? []

          const _args = cmdArgs
            .replaceAll("'", '')
            .split(',')
            .map((arg) => arg.trim())
            .filter((f) => f)
          // @ts-expect-error this is a array
          commands[command][kind].push({
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
        import { SyncArg, SyncTag } from '@cmder/parser'
          ${syncs.join('\n')}
          ${code}`
      }
      const result = transpiler.transformSync(code.replaceAll(/(import .*)( with \{.*)(;)?/gm, '$1$3'))
      return {
        contents: result,
        loader: 'ts',
      }
    })

    build.onLoad({ filter: /.hp$/ }, (args) => {
      const command = commands[getCommandName(args.path)]
      const code = readFileSync(args.path, 'utf-8')
      const contents = `export const content=\`${code}\`
      export const data=${JSON.stringify(command, null, 2)}`
      return {
        contents: transpiler.transformSync(contents),
        loader: 'ts',
      }
    })
  },
}
