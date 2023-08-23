import { parserMap } from './mappings'

export function RegisterParser<T>(type: string, parser: ParserFn<T>) {
  parserMap.set(type, parser)
}
