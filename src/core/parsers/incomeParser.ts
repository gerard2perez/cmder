import { RegisterParser } from '../parser/register'

export default RegisterParser('Income', function incomeParser(data: string) {
  const [amount, iva = 0] = data.split(':').map((val) => Number(val))
  return { amount, iva }
})
