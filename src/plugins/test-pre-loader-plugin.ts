import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
const transpiler = new Bun.Transpiler({ loader: 'ts' })

Bun.plugin({
  target: 'bun',
  name: 'test loader',
  async setup(build) {
    const glob = new Bun.Glob('**/**/*.mock.ts')
    const mockedModules = await Array.fromAsync(glob.scan({ cwd: 'src', absolute: true }))

    for (const file of mockedModules) {
      const originalFile = file.replace('.mock', '')
      const contents = readFileSync(originalFile, 'utf-8')
      const path = `${originalFile}.original`
      build.module(path, () => {
        return {
          contents: transpiler.transformSync(contents),
        }
      })
    }
    build.onResolve({ filter: /.*/, namespace: 'original' }, (args) => {
      return {
        path: resolve(dirname(args.importer), args.path).replace('.ts', '') + '.ts.original',
      }
    })
  },
})
