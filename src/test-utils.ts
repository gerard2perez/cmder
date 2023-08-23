// jest.mock('./getArgv')
import { _getArgv } from './getArgv'
export const setArgv = (args: string[]) => {
  return (_getArgv as jest.MockedFn<typeof _getArgv>).mockReturnValueOnce(args)
}
