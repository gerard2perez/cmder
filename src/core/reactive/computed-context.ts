import { isRef } from '@g2p/cmder/reactive/ref'

type ContextBuilder = {
  key: string
  regExp: RegExp
  value: FunctionLike
}

export function withContext<T extends NonNullable<unknown>>(context: T, input: string) {
  const computedProps: ContextBuilder[] = []
  const functionalProps: ContextBuilder[] = []
  const rawProps: ContextBuilder[] = []
  for (const [key, data] of Object.entries(context)) {
    const item: ContextBuilder = {
      key,
      regExp: new RegExp(`{${key}([|}])`, 'gm'),
      value: () => undefined,
    } satisfies ContextBuilder
    if (isRef(data)) {
      item.value = () => data.value
      computedProps.push(item)
    } else if (data instanceof Function) {
      item.value = data as FunctionLike
      functionalProps.push(item)
    } else {
      item.value = () => data
      rawProps.push(item)
    }
  }
  function createContext() {
    return [...rawProps, ...computedProps].reduce(
      (result, curr) => {
        result[curr.key] = curr.value()
        return result
      },
      {} as Record<string, unknown>,
    )
  }
  // During frame rendering
  const frame = () => {
    const objectContext = createContext()

    return [
      ...rawProps,
      ...computedProps,
      ...functionalProps.map((item) => ({
        ...item,
        value: item.value.bind(null, objectContext),
      })),
    ].reduce((result, { regExp, value }) => result.replaceAll(regExp, `{${value()}$1`), input)
  }
  return { createContext, frame }
}
