export default function incomeParser(data: string): Income {
  const [amount, iva = 0] = data.split(':').map((val) => Number(val))
  return { amount, iva }
}
