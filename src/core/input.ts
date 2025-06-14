import { getArgv } from './get-argv'

let input: string | undefined
export function getInput() {
  if (input === undefined) {
    input = ''
    const args = getArgv()
    for (let i = 0; i < args.length; i++) {
      const cArg = args.at(i)
      const nArg = args.at(i + 1)
      if (cArg?.startsWith('-') && nArg && !nArg.startsWith('-')) {
        input += ` ${cArg}="${nArg}"`
        i++
      } else if (cArg?.startsWith('-') && cArg?.includes('=')) {
        input += ` ${cArg.replace(/=(.*)/g, '="$1"')}`
      } else if (cArg?.startsWith('-')) {
        input += ` ${cArg}`
      } else {
        input += ` "${cArg}"`
      }
    }
    input = input.trim().replace('\x01', '')
  }
  return input
}
export function updateInput(subs: string) {
  input = input!.replace(subs, '').trim()
}
export function clearInput(config: TagParser) {
  const tagParam = config.compact ? '' : '\\="[^" ]*"'
  const tagExp = new RegExp(` ?\\-+${config.tag}${tagParam}`, 'gi')
  input = input!.replaceAll(tagExp, '').trim()
  if (config.alias) {
    const aliasExp = new RegExp(` ?\\-+${config.alias}${tagParam}`, 'gi')
    input = input.replaceAll(aliasExp, '').trim()
  }
}
export function resetInput() {
  input = undefined
}
