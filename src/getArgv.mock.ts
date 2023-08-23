import { AnyFunction } from 'bun'
import { mock } from 'bun:test'
export default <T>(fn: T) => mock(fn as AnyFunction)
