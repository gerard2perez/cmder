import { plugin, Transpiler } from 'bun'

const transpiler = new Transpiler({
  loader: 'ts', // "js | "jsx" | "ts" | "tsx"
})

plugin({
  name: 'cmder',
  async setup(build) {
    const { readFileSync } = await import('fs')
    build.onLoad({ filter: /.mce$/ }, (args) => {
      const text = readFileSync(args.path, 'utf8')
      return {
        exports: { default: text },
        loader: 'object', // special loader for JS objects
      }
    })
    // auto-register parsers
    build.onLoad({ filter: /.*Parser.ts$/ }, (args) => {
      let code = readFileSync(args.path, 'utf8')
      const [, parser, type] = /function +(.*)\(.*: +(.*) {/.exec(code) as string[]
      code = `${code}
      Reflect.decorate([Reflect.metadata("design:returntype", '${type}')],${parser})`
      const result = transpiler.transformSync(code)
      return {
        contents: result,
        loader: 'ts', // special loader for JS objects
      }
    })
    // sync command tag and args
    build.onLoad({ filter: /.*.ts$/ }, (args) => {
      let code = readFileSync(args.path, 'utf8')
      if (code.search(/import.*(tag|arg).*from '@cmder'/) > -1) {
        console.log(args)
        const syncs = []
        for (const [, , name, preType, kind] of code.matchAll(/(const|let) *(.*): *(.*) *= *(tag|arg).*/g)) {
          const [type, multiple] = preType.trim().split('[')
          if (kind === 'tag') {
            syncs.push(`SyncTag('${name}','${type}',${!!multiple})`)
          } else {
            syncs.push(`SyncArg('${type}')`)
          }
        }
        code = `import { SyncArg, SyncTag } from '@cmder/parser'
        ${syncs.join('\n')}
        ${code}`
      }
      const result = transpiler.transformSync(code)
      return {
        contents: result,
        loader: 'ts',
      }
    })
  },
})
