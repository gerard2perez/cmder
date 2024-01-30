import { computed_ } from '@g2p/cmder/spinner/context-object/computed'
export function withContext<T extends NonNullable<unknown>>(context: T, input: string) {
  const computed = Object.entries<computed_<unknown>>(context)
    .filter((v) => v[1] instanceof computed_)
    .map(([key, cmp]) => ({ key: new RegExp(`{${key}([|}])`, 'gm'), value: () => cmp.value }))
  const functions = Object.entries<FunctionConstructor>(context)
    .filter((v) => v[1] instanceof Function)
    .map(([key, cb]) => ({ key: new RegExp(`{${key}([|}])`, 'gm'), value: cb }))

  const replacers = [...computed, ...functions]

  return () => replacers.reduce((result, { key, value }) => result.replaceAll(key, `{${value()}$1`), input)
}
