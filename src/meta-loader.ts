import { readdirSync } from 'fs'

import 'reflect-metadata'
import { RegisterParser } from './parser'
import { dirname } from 'node:path/posix'
const loc = (file = '') => `${dirname(import.meta.url.replace('file://', ''))}/parsers/${file}`
const all = readdirSync(loc())
  .filter((file) => !file.includes('.test.ts'))
  .map(async (file) => {
    const parser = (await import(loc(file))).default
    const meta = Reflect.getMetadata('design:returntype', parser)
    if (meta) {
      RegisterParser(meta, parser)
    }
  })

await Promise.all(all)
