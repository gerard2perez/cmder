import { arg } from '@cmder'

const command: string = arg()

export default async function cmder() {
  const moduleCommand = `../commands/${command}.ts`
  const isCompiled = import.meta.url.includes('compiled')
  if (process.env.NODE_ENV === 'production' && isCompiled) {
    // filled at build time
  } else {
    await import(moduleCommand)
  }
}
