import type { BunPlugin } from 'bun'
const transpiler = new Bun.Transpiler({
  loader: 'ts', // "js | "jsx" | "ts" | "tsx"
})
export const cmderLoader: BunPlugin = {
  target: 'bun',
  name: 'cmder loader',
  async setup(build) {
    if (process.argv0 !== 'bun') {
      return
    }
    const { readFileSync, readdirSync } = await import('fs')

    build.onLoad({ filter: /cmder.ts/ }, (args) => {
      const commands = readdirSync(Bun.env.SUB_MODULES as string).map((cmd) => cmd.replace('.ts', ''))
      const code = readFileSync(args.path, 'utf8')
      const injection = `const scopeHack = {
        ${commands.map((cmd) => `['${cmd}']: async () => await import('../commands/${cmd}'),`).join('\n')}
      }
      await scopeHack[command.replace('.ts', '')]()`
      const added = code.replace('// filled at build time', injection)
      const contents = transpiler.transformSync(added)
      return {
        contents,
        loader: 'ts',
      }
    })

    build.onLoad({ filter: /.ts/ }, (args) => {
      let code = readFileSync(args.path, 'utf8')

      if (code.search(/import.*(tag|arg).*from '@cmder'/) > -1) {
        const syncs = []
        for (const [, , name, preType, kind] of code.matchAll(/(const|let) *(.*): *(.*) *= *(tag|arg).*/g)) {
          const [type, multiple] = preType.trim().split('[')
          if (kind === 'tag') {
            syncs.push(`SyncTag('${name}','${type}',${!!multiple})`)
          } else {
            syncs.push(`SyncArg('${type}')`)
          }
        }
        code = `
        import { SyncArg, SyncTag } from '@cmder/parser'
          ${syncs.join('\n')}
          ${code}`
      }
      const result = transpiler.transformSync(code.replaceAll(/(import .*)( with \{.*)(;)?/gm, '$1$3'))
      return {
        contents: result,
        loader: 'ts',
      }
    })
  },
}
