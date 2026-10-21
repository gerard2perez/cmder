import { type BunPlugin } from 'bun'
import { VirtualCommandResolver } from './resolver'
import { VirtualCommandLoader } from './loader'

export const CmderVirtualCommandPlugin: BunPlugin = {
  target: 'bun',
  name: 'Cmder virtual commands',
  async setup(build) {
    if (!(process.argv0.includes('bun') || process.argv0.includes('cmder'))) {
      return
    }
    build.onResolve({ filter: /virtual:/ }, VirtualCommandResolver)
    build.onLoad({ filter: /./, namespace: 'virtual' }, VirtualCommandLoader)
  },
}
