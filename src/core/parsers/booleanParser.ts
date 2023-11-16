import { RegisterParser } from '../parser/register'

export default RegisterParser('boolean', function booleanParser(data: string): boolean {
  return !data
})
