/* eslint-disable @typescript-eslint/no-explicit-any */
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
}
interface CommandMeta {
  command: string
  arg: ParameterMeta[]
  tag: ParameterMeta[]
}
interface Theme {
  text: string
  command: {
    primary: string
    secondary: string
  }
  arg: string
  tag: {
    primary: string
    secondary: string
  }
}

type FunctionLike = (...args: any[]) => any
