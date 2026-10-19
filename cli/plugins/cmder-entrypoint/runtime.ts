import type { BunPlugin } from 'bun'
import { resolve } from 'path/posix'

export const CmderEntrypointPlugin: BunPlugin = {
  target: 'bun',
  name: 'CMDer Entrypoint Plugin',
  setup(build) {
    build.onResolve({ filter: /^virtual:cmder-entrypoint$/ }, () => ({
      path: 'cmder-entrypoint',
      namespace: 'virtual-entrypoint',
    }))

    build.onLoad({ filter: /.*/, namespace: 'virtual-entrypoint' }, () => ({
      contents: `import cmder from './cli/core'
await cmder()`,
      loader: 'ts',
    }))
  },
} as BunPlugin
