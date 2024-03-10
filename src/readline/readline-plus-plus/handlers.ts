import { OnDataEvents } from '@g2p/cmder/readline/create-interface/on-input-data'
import type { Ref } from '@g2p/cmder/reactive/ref/ref'
import { ref } from '@g2p/cmder/spinner/spinner'
import type { ReadStream } from 'node:tty'

type ExtractHandlerRefValue<T> = T extends { handler: Ref<infer F> } ? F : never
export interface HandlerType {
  (stdin: ReadStream): {
    handler: Ref<NonNullable<unknown>>
    tick: Ref<(...args: never) => void>
  }
}
export type GetHandlerReturnType<H> = H extends (stdin: ReadStream) => infer F ? ExtractHandlerRefValue<F> : never

/**
 * Handler return direction -1 for ↑ and  1 for ↓
 */
export function upDownHandler(limit: number) {
  return ((stdin) => {
    const selectedIndex = ref(0)
    const tick = ref(() => undefined)
    stdin.on(OnDataEvents.up_down, (dir: number) => {
      selectedIndex.value += dir
      if (selectedIndex.value < 0) selectedIndex.value = limit - 1
      if (selectedIndex.value >= limit) selectedIndex.value = 0
      tick.value()
    })
    return { handler: selectedIndex, tick }
  }) satisfies HandlerType
}
/**
 * Handler return direction -1 for <- and  1 for ->
 */
export function leftRightHandler() {
  return ((stdin) => {
    const handler = ref(false)
    const tick = ref(() => undefined)
    stdin.on(OnDataEvents.left_right, (dir: number) => {
      handler.value = dir === 1
      tick.value()
    })
    return { handler, tick }
  }) satisfies HandlerType
}

/**
 * Tells if the prompt has a value
 */
export function promptSpy() {
  return ((stdin) => {
    const handler = ref(false)
    const tick = ref(() => undefined)
    stdin.on(OnDataEvents.prompt, (hasContent: boolean) => {
      handler.value = hasContent
      tick.value()
    })
    return { handler, tick }
  }) satisfies HandlerType
}
