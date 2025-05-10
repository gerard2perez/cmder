let argv: string[] = []
export function getArgv() {
  if (!argv.length) {
    argv = [...process.argv].splice(2)
  }
  return argv
}
// async function ifTest() {
//   const { default: mock } = await import('./get-argv.mock.test')
//   return mock(get-argv)
// }

// const original = process.env.NODE_ENV === 'test' ? await ifTest() : get-argv
// export { original as get-argv }
