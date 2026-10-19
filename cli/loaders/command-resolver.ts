import commandsStore, { getCommandName } from './commands-store'
import type { OnLoadArgs, OnLoadResult } from 'bun'
import { readFileSync } from 'node:fs'

const transpiler = new Bun.Transpiler({
  loader: 'ts', // "js | "jsx" | "ts" | "tsx"
})

export default function CommandResolver(args: OnLoadArgs): OnLoadResult | Promise<OnLoadResult> {
  let code = readFileSync(args.path + '.ts', 'utf8')
  const command = getCommandName(args.path)
  commandsStore[command] = commandsStore[command] ?? { arg: [], tag: [] }
  commandsStore[command].command = command
  if (code.search(/import.*(tag|arg).*from.*@g2p\/cmder/) > -1) {
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
}
