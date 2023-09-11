import { RegisterParser } from '../parser/register'

export default RegisterParser('number', function numberParser(data: string): number {
  return Number(data)
})
