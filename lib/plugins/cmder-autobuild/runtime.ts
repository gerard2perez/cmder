import { type BunPlugin } from 'bun'
import { ParametersSyncLoader } from './loader'

export const ParameterSyncPlugin: BunPlugin = {
  target: 'bun',
  name: 'Use for autobuild commands',
  async setup(build) {
    build.onLoad({ filter: /build\.ts/ }, ParametersSyncLoader)
  },
}
