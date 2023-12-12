import { arg, tag } from '@g2p/cmder'
import { cmderLoader } from '@g2p/cmder/loaders/cmder-loader'
import { build } from 'bun'
const entrypoint: string = arg()
// const { default: proyPack } = await import(resolve('package.json'))
const name: string = tag('name', 'n', 'the name for the executable')!
const outdir = './bin'
const presult = build({
  entrypoints: [entrypoint],
  target: 'bun',
  format: 'esm',
  minify: false,
  splitting: false,
  root: 'src',
  outdir,
  sourcemap: 'none',
  plugins: [cmderLoader],
})

presult.then(async (result) => {
  if (result.success) {
    const r2 = Bun.spawnSync({
      cmd: ['bun', 'build', outdir, '--compile', '--outfile', `${outdir}/${name}`],
    })
    console.log(r2.stdout.toString())
    console.log(r2.stderr.toString())

    result.outputs.forEach((bundle) => {
      // console.log(bundle)
      // import.meta.require('fs').unlinkSync(bundle.path)
    })
  } else {
    console.log(result)
  }
})
