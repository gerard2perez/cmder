import commandsStore, { getCommandName } from './commands-store'
import type { OnLoadArgs, OnLoadResult } from 'bun'
import { readFileSync } from 'node:fs'
import { parse } from 'yaml'
export const DEFAULT_THEME: Theme = {
  arg: 'green',
  text: 'white',
  command: {
    primary: 'yellow',
    secondary: 'yellow',
  },
  tag: {
    primary: 'cyan',
    secondary: 'gray',
  },
}
const transpiler = new Bun.Transpiler({
  loader: 'ts', // "js | "jsx" | "ts" | "tsx"
})

export default function HPResolver(args: OnLoadArgs): OnLoadResult | Promise<OnLoadResult> {
  const command = commandsStore[getCommandName(args.path)]
  const code = readFileSync(args.path, 'utf-8')
  const [template, _theme = ''] = code.split('[theme]')
  const theme = parse(_theme.replaceAll(/rgb\((.*),(.*),(.*)\)/gm, '>\n rgb:$1:$2:$3')) as Theme
  const THEME = {
    ...DEFAULT_THEME,
    ...theme,
    command: {
      ...DEFAULT_THEME.command,
      ...theme?.command,
    },
    tag: {
      ...DEFAULT_THEME.tag,
      ...theme?.tag,
    },
  }
  const contents = `export const content=\`${template}\`
  export const data=${JSON.stringify(command, null, 2)}
  export const theme=${JSON.stringify(THEME, null, 2)}`
  return {
    contents: transpiler.transformSync(contents),
    loader: 'js',
  }
}
