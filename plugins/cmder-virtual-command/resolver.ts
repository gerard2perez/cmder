import type { OnResolveArgs } from 'bun'

export function VirtualCommandResolver(args: OnResolveArgs) {
  const path = args.path.replace('virtual:', '')
  return {
    path,
    namespace: 'virtual',
  }
}
