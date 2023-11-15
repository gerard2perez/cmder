import { arg } from '@cmder'
const command: string = arg()

export default async function cmder() {
  if (Bun.env.SUB_MODULES && !command) {
    throw new Error(' A command is required')
  }
  const moduleCommand = `../commands/${command}.ts`
  const isCompiled = import.meta.url.includes('compiled')
  if (process.env.NODE_ENV === 'production' && isCompiled) {
    // filled at build time
  } else {
    await import(moduleCommand)
  }
}
