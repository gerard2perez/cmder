import { _getArgv } from './getArgv'

let input = ''
export function getInput() {
  if (!input) {
    const args = _getArgv()
    for (let i = 0; i < args.length; i++) {
      const cArg = args.at(i)
      const nArg = args.at(i + 1)
      if (cArg?.startsWith('-') && !nArg?.startsWith('-')) {
        input += ` ${cArg}="${nArg}"`
        i++
      } else if (cArg?.startsWith('-')) {
        input += ` ${cArg.replace(/=(.*)/g, '="$1"')}`
      } else {
        input += ` "${cArg}"`
      }
    }
    input = input.trim().replace('\x01', '')
  }
  return input
}
export function updateInput(subs: string) {
  input = input.replace(subs, '').trim()
}
export function clearInput(config: TagParser) {
  const tagExp = new RegExp(` ?\\-+${config.tag}\\="[^" ]*"`, 'gi')
  input = input.replaceAll(tagExp, '').trim()
  if (config.alias) {
    const aliasExp = new RegExp(` ?\\-+${config.alias}\\="[^" ]*"`, 'gi')
    input = input.replaceAll(aliasExp, '').trim()
  }
}
