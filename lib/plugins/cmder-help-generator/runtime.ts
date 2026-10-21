import { type BunPlugin } from 'bun'
import { HelpLoader } from './loader'

const compiled = ['cdr', 'cmder']
export const CmderHelpGeneratorPlugin: BunPlugin = {
  target: 'bun',
  name: 'help loader',
  async setup(build) {
    if (!(process.argv0.includes('bun') || compiled.includes(process.argv0))) {
      return
    }
    build.onResolve({ filter: /\.hp$/ }, (args) => ({
      path: args.path,
      namespace: 'help',
    }))
    build.onLoad({ filter: /./, namespace: 'help' }, HelpLoader)
  },
}
