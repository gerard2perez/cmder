// import { AnyFunction } from 'bun'
import { Mock, mock } from 'bun:test'
import { getArgv } from './get-argv'
// export default <T>(fn: T) => mock(fn as AnyFunction)
export default {
  getArgv: mock(() => {}),
}

export function setArgv(args: string[]) {
  // console.log({ get-argv })
  return (getArgv as Mock<typeof getArgv>).mockReturnValueOnce(args)
}
