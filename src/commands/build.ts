import { arg, tag } from '@cmder'
import { cmderLoader } from '../core/cmderLoader'
import { build } from 'bun'

const entrypoint: string = arg()
// const { default: proyPack } = await import(resolve('package.json'))
const name: string = tag('name', 'n', 'the name for the executable')
const outdir = '../cmder-compiled'

const presult = build({
  entrypoints: [entrypoint],
  target: 'bun',
  // splitting: false,
  // format: 'esm',
  minify: false,
  root: 'src',
  outdir,
  sourcemap: 'none',
  // splitting: false,
  plugins: [cmderLoader],
})

presult.then(async (result) => {
  const r2 = Bun.spawnSync({
    cmd: ['bun', 'build', outdir, '--compile', '--outfile', `../cmder-compiled/${name}`],
  })

  console.log(r2.stdout.toString())
  console.log(r2.stderr.toString())

  result.outputs.forEach((bundle) => {
    import.meta.require('fs').unlinkSync(bundle.path)
  })
})
