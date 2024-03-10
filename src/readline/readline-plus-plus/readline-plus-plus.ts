/* eslint-disable @typescript-eslint/no-explicit-any */
import { withContext } from '@g2p/cmder/reactive/ref/computed-context'
import { ref } from '@g2p/cmder/reactive/ref/ref'
import { createInterfacePlusPlus } from '../create-interface/create-interface-plus-plus'
import { statusManager } from './status-manager'
import { textCompiler } from '@g2p/cmder/text-formatter/text-compiler'
import { stdin as input, stdout as output } from 'node:process'
import { GetHandlerReturnType, HandlerType } from '@g2p/cmder/readline/readline-plus-plus/handlers'

type Options<Context, Handler, ResponseType> = {
  hideCursor: boolean
  handler: Handler
  extractor: (context: Context) => ResponseType
}
type Formatters<FrameContext> = {
  [formatter: string]: (context: FrameContext) => unknown
}
interface InternalDataContext<H> {
  indicator: string
  status: string
  result: unknown
  handler: GetHandlerReturnType<H>
  ended: boolean
}

async function errorTrap(promise: Promise<undefined | string>) {
  let error = undefined
  let value = undefined
  try {
    value = await promise
  } catch (e) {
    error = e
  }
  return { error, value }
}

/**
 * @throws {Error} Operation cancelled
 */
export async function readLinePlusPlus<
  ReturnType,
  Handler extends HandlerType,
  DataContext extends { defaults: string | undefined },
  FrameContext extends DataContext & InternalDataContext<Handler>,
>(
  template: string,
  context: DataContext,
  formatters: Formatters<FrameContext>,
  options: Options<FrameContext, Handler, ReturnType>,
  { stdin = input, stdout = output } = {},
): Promise<ReturnType> {
  const result = ref<null | string | undefined>(null)
  const { ended, status, commit, indicator } = statusManager()
  const { handler, tick } = options.handler(stdin)
  const { createContext, frame } = withContext(
    { ...context, ...formatters, indicator, status, result, handler, ended },
    template,
  )
  const frameCompiler = () => textCompiler`${frame()}`
  const { waitInput, pushFrame } = createInterfacePlusPlus(stdin, stdout, true, frameCompiler)
  tick.value = pushFrame

  return await errorTrap(waitInput())
    .then(({ value, error }) => {
      const context = {
        ...createContext(),
        result: commit(value),
      } as FrameContext
      result.value = options.extractor(context) as never
      if (error) {
        throw error
      }
      return result.value
    })
    .finally(() => pushFrame(true))
}
