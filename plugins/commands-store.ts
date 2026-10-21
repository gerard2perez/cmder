import { basename, resolve } from 'path'

export const commandsStore = {} as Record<string, Record<string, object[] | string>>

export function getCommandName(urlpath: string) {
  return basename(urlpath).replace('.hp', '').replace('.ts', '')
}
