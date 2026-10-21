import type { BunPlugin } from 'bun'
import { DetectCommandsLoader } from './loader'

export const CmderEntrypointPlugin: BunPlugin = {
  target: 'bun',
  name: 'CMDer Entrypoint Plugin',
  setup(build) {
    build.onResolve({ filter: /^virtual:cmder-entrypoint$/ }, () => ({
      path: 'cmder-entrypoint',
      namespace: 'virtual-entrypoint',
    }))

    build.onLoad({ filter: /cmder-entrypoint/, namespace: 'virtual-entrypoint' }, () => ({
      contents: `import cmder from '@g2p/cmder';\nawait cmder();`,
      loader: 'ts',
    }))

    build.onLoad({ filter: /cmder\.ts/ }, DetectCommandsLoader)
  },
}
