import { LogSymbols } from '../symbols'
import { RegisterFormatter } from '../register-formatter'

RegisterFormatter(function (symbol: string) {
  return `${LogSymbols[symbol as unknown as LogSymbols]}`
}, 'sy')
RegisterFormatter(function (symbol: string) {
  return `${LogSymbols[symbol as unknown as LogSymbols]}`
}, 'ico')
