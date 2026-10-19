import { arg, tag } from '../core'
import { cmderLoader } from '../loaders/cmder-loader'
import { build } from 'bun'

const entrypoint: string = arg()

const name: string = tag('name', 'n', 'the name for the executable')!
const outdir: string = tag('outout', 'o', 'Set the default output directory') ?? './'

const presult = build({
  entrypoints: [entrypoint],
  target: 'bun',
  format: 'esm',
  minify: false,
  splitting: false,
  root: Bun.env.CDR_ROOT ?? 'cli',
  naming: `${name}.ts`,
  outdir,
  sourcemap: 'none',
  plugins: [cmderLoader],
})

presult.then(async ({ success, outputs, ...rest }) => {
  const [output] = outputs
  if (success) {
    const r2 = Bun.spawnSync({
      cmd: ['bun', 'build', output.path, '--compile', '--outfile', `${outdir}/${name}`],
    })
    console.log(r2.stdout.toString())
    console.log(r2.stderr.toString())

    outputs.forEach((bundle) => {
      // console.log(bundle)
      // import.meta.require('fs').unlinkSync(bundle.path)
    })
  } else {
    console.log({ success, outputs, ...rest })
  }
})
