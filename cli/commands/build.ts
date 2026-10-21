import { CmderEntrypointPlugin } from '../../plugins/cmder-entrypoint/runtime'
import { CmderHelpGeneratorPlugin } from '../../plugins/cmder-help-generator/runtime'
import { arg, tag } from '../core'
import { build } from 'bun'
import { CmderVirtualCommandPlugin } from '../../plugins/cmder-virtual-command/runtime'

// const entrypoint: string = arg()

// const name: string = tag('name', 'n', 'the name for the executable')!
const name: string = arg()
const outdir: string = tag('outout', 'o', 'Set the default output directory') ?? './'
const compile: boolean = tag('compile', 'c', 'Compile the output to a single file') ?? false

const buildResult = build({
  entrypoints: ['virtual:cmder-entrypoint'],
  target: 'bun',
  format: 'esm',
  minify: false,
  splitting: false,
  root: Bun.env.CDR_ROOT ?? 'cli',
  naming: `${name}.js`,
  outdir,
  sourcemap: 'none',
  plugins: [CmderEntrypointPlugin, CmderVirtualCommandPlugin, CmderHelpGeneratorPlugin],
})

buildResult.then(async ({ success, outputs, ...rest }) => {
  const [output] = outputs
  if (success && compile) {
    const r2 = Bun.spawnSync({
      cmd: ['bun', 'build', output.path, '--compile', '--outfile', `${outdir}/${name}.js`],
    })
    console.log(r2.stdout.toString())
    console.log(r2.stderr.toString())

    outputs.forEach((bundle) => {
      // console.log(bundle)
      // import.meta.require('fs').unlinkSync(bundle.path)
    })
  } else if (!success) {
    console.log({ success, outputs, ...rest })
  }
})
