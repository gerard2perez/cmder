import { basename, resolve } from 'path'

const commands = {} as Record<string, Record<string, object[] | string>>

export function getCommandName(urlpath: string) {
  return basename(urlpath).replace('.hp', '').replace('.ts', '')
}
export default commands
