import { getInput } from './input'
import { getParserInformation, parseTag } from './parser'
export function tag<T>(tag: string, description: string): T | undefined
export function tag<T>(tag: string, alias: string, description: string): T | undefined
export function tag<T>(tag: string, _alias: string, _description?: string): T | undefined {
  const alias = !!_alias && !!_description ? _alias : undefined
  const description = _description ?? _alias
  const { compact, multiple, parser } = getParserInformation(tag)
  return parseTag(getInput(), { tag, alias, compact, multiple, parser, description }) as T | undefined
}
