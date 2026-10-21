import type { OnLoadArgs, OnLoadResult } from 'bun'
import { join, resolve } from 'path/posix'
import { readFileSync, readdirSync } from 'fs'

const transpiler = new Bun.Transpiler({ loader: 'ts' })

/**
 * Detect all commands in the commands folder and inject them into the cmder.ts file
 */
export async function DetectCommandsLoader(args: OnLoadArgs) {
  const rootPath = resolve(Bun.env.CDR_ROOT ?? 'cli')

  const commandList = readdirSync(rootPath)
    .filter((cmd) => !cmd.includes('.hp'))
    .map((cmd) => cmd.replace('.ts', ''))

  const injectVirtual = commandList
    .map((cmd) => `['${cmd}']: async () => import('virtual:${join(rootPath, cmd)}.ts')`)
    .join(',\n')
  const injectHelp = commandList
    .map((cmd) => `['${cmd}.hp']: async () => import('help:${join(rootPath, cmd)}.hp')`)
    .join(',\n')

  const commands = `'${commandList.join("',\n    '")}'`

  const code = readFileSync(args.path, 'utf8')
  const injection = `// import hack\n${injectVirtual},\n${injectHelp}`
  const added = code.replace('// import hack', injection).replace('// autodetect files', commands)

  const contents = transpiler.transformSync(added)
  return {
    contents,
    loader: 'ts',
  } satisfies OnLoadResult
}
