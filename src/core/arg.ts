import { getInput } from './input'
import { getArgParser, parseArg } from './parser'

export function arg<T>(): T | undefined {
  const parser = getArgParser()
  return parseArg(getInput(), parser) as T | undefined
}
