interface TagParser {
  tag: string
  compact: boolean
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
declare module '*.hp' {
  const mdContent: string
  export default mdContent
}

interface ParameterMeta {
  alias: string
  description?: string
  type: string
  multiple: boolean
  compact: boolean
  name: string
  args: string[]
}
interface CommandMeta {
  command: string
  arg: ParameterMeta[]
  tag: ParameterMeta[]
}
