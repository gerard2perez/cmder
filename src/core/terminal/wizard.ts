/* eslint-disable @typescript-eslint/no-explicit-any */
import { withContext } from '@g2p/cmder/reactive/computed-context'
import { ref } from '@g2p/cmder/spinner/spinner'
import { textCompiler } from '@g2p/cmder/text-formatter/text-compiler'
type Configuration = {
  onCancel: string
}
type ResolveType<T> = {
  [K in keyof T]: T[K] extends (...args: any) => Promise<infer V> ? V : never
}
export async function wizard<Keys extends string, T extends { [k in Keys]: (...args: any) => Promise<unknown> }>(
  steps: T,
  { onCancel = `{${'✖'}|red} {message}` } = {} as Configuration,
) {
  const message = ref('')
  const errorCompiler = withContext({ message }, onCancel)
  const results = {} as ResolveType<T>
  for (const [key, ask] of Object.entries<() => Promise<unknown>>(steps)) {
    try {
      // @ts-expect-error key type is missing
      results[key] = await ask(results)
    } catch (ex) {
      message.value = (ex as Error).message
      console.log(textCompiler`${errorCompiler.frame()}`)
      break
    }
  }
  return results
}
