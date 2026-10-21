import { clearInput, updateInput } from '../input'
import { argMap, parserMap, tagMap } from './mappings'

export function SyncTag(tag: string, type: string, multiple: boolean = false) {
  tagMap.set(tag, { type, multiple })
}
export function SyncArg(type: string) {
  argMap.push(type)
}
export function getParserInformation(tag: string) {
  const { type, multiple } = tagMap.get(tag) ?? { type: 'string', multiple: false }
  const parser = parserMap.get(type) ?? ((input: string) => input)
  return {
    compact: type === 'boolean',
    multiple,
    parser,
  }
}
export function getArgParser() {
  return parserMap.get(argMap.shift()!) ?? ((text: unknown) => text)
}
export function parseTag(input: string, next: TagParser) {
  const { compact, tag, alias, parser, multiple } = next
  const tagParam = compact ? '' : '\\="([^\x01]*)"'
  const exp = alias ? new RegExp(`(--${tag}|-${alias})${tagParam}`, 'gi') : new RegExp(`(--${tag})${tagParam}`, 'gi')
  const patch = input.replaceAll('" "', '"\x01"').replaceAll('" -', '"\x01-')
  const val = [...patch.matchAll(exp)].map(([, tag, arg]) => (parser ? parser(arg || tag) : arg || tag))
  const [first] = val
  clearInput(next)
  const valueExists = multiple ? val : first
  return !first ? undefined : valueExists
}
export function parseArg<T>(input: string, parser: ParserFn<T>) {
  const arg =
    input
      .replaceAll('" "', '"\x01"')
      .replaceAll('" -', '"\x01-')
      .split('\x01')
      .find((arg) => !arg.startsWith('-')) ?? ''
  updateInput(arg)
  return input ? parser(arg.replaceAll(/^"(.*)"$/g, '$1')) : undefined
}

export { RegisterParser } from './register'
