let argv: string[] = []
export function getArgv() {
  if (!argv.length) {
    argv = [...process.argv].splice(2)
  }
  return argv
}
