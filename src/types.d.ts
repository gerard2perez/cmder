interface TagParser {
  tag: string
  alias?: string
  parser: ParserFn<unknown>
  multiple: boolean
  description?: string
}
type ParserFn<T> = (input: string) => T
interface Income {
  amount: number
  iva: number
}
