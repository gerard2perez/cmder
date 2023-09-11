import { clearInput, updateInput } from '../input'
import { argMap, parserMap, tagMap } from './mappings'

export function SyncTag(tag: string, type: string, multiple: boolean = false) {
  tagMap.set(tag, { type, multiple })
}
export function SyncArg(type: string) {
  argMap.push(type)
}
export function getParserInformation(tag: string) {
  const { type, multiple } = tagMap.get(tag)!
  const parser = parserMap.get(type) ?? ((input: string) => input)
  return {
    type,
    multiple,
    parser,
  }
}
export function getArgParser() {
  return parserMap.get(argMap.shift()!) ?? ((text: unknown) => text)
}
export function parseTag(input: string, next: TagParser) {
  const { tag, alias, parser, multiple } = next
  const exp = alias
    ? new RegExp(`[\\-\\-${tag}|\\-${alias}]\\="([^\x01]*)"`, 'gi')
    : new RegExp(`\\-\\-${tag}\\="([^\x01]*)"`, 'gi')
  const patch = input.replaceAll('" "', '"\x01"').replaceAll('" -', '"\x01-')
  const val = [...patch.matchAll(exp)].map(([, arg]) => (parser ? parser(arg) : arg))
  clearInput(next)
  return multiple ? val : val[val.length - 1]
}
export function parseArg<T>(input: string, parser: ParserFn<T>) {
  const [arg] = input.replaceAll('" "', '"\x01"').replaceAll('" -', '"\x01-').split('\x01')
  updateInput(arg)
  return parser(arg.replaceAll(/^"(.*)"$/g, '$1'))
}

export { RegisterParser } from './register'
