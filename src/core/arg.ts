import { getInput } from './input'
import { getArgParser, parseArg } from './parser'

export function arg<T>(): T {
  const parser = getArgParser()
  return parseArg(getInput(), parser) as T
}
