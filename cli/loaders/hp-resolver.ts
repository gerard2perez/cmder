import commandsStore, { getCommandName } from './commands-store'
import type { OnLoadArgs, OnLoadResult } from 'bun'
import { readFileSync, existsSync } from 'node:fs'
import { parse } from 'yaml'
import { DEFAULT_HELP_THEME } from '../core/help-default-theme'

const transpiler = new Bun.Transpiler({
  loader: 'ts', // "js | "jsx" | "ts" | "tsx"
})

export default function HPResolver(args: OnLoadArgs): OnLoadResult | Promise<OnLoadResult> {
  const command = commandsStore[getCommandName(args.path)]
  const code = existsSync(args.path)
    ? readFileSync(args.path, 'utf-8')
    : `%app% %command% %arguments% {[options]|theme.tag.primary}
  {This creates a beauty help|theme.text}
   %tags%
`
  const [template, _theme = ''] = code.split('[theme]')
  const theme = parse(_theme.replaceAll(/rgb\((.*),(.*),(.*)\)/gm, '>\n rgb:$1:$2:$3')) as Theme
  const THEME = {
    ...DEFAULT_HELP_THEME,
    ...theme,
    command: {
      ...DEFAULT_HELP_THEME.command,
      ...theme?.command,
    },
    tag: {
      ...DEFAULT_HELP_THEME.tag,
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
