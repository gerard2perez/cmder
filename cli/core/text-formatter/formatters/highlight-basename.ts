import chalk, { type ChalkInstance } from 'chalk'
import { basename, dirname, posix } from 'path'
import { RegisterFormatter } from '../register-formatter'

export function highlightBasename(path: string, primary = 'green', secondary = 'white') {
  const secondaryC = chalk[secondary as keyof ChalkInstance] as CallableFunction
  const primaryC = chalk[primary as keyof ChalkInstance] as CallableFunction
  const directory = secondaryC(dirname(path).replace(/\\/gm, posix.sep) + '/').replace('./', '')
  const file = chalk.bold(primaryC(basename(path)))
  return `${directory}${file}`
}
RegisterFormatter(highlightBasename, 'highlightBasename')
