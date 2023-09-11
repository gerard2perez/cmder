let argv: string[] = []
function _getArgv() {
  if (!argv.length) {
    argv = [...process.argv].splice(2)
  }
  return argv
}
async function ifTest() {
  const { default: mock } = await import('./getArgv.mock')
  return mock(_getArgv)
}

const original = process.env.NODE_ENV === 'test' ? await ifTest() : _getArgv
export { original as _getArgv }
