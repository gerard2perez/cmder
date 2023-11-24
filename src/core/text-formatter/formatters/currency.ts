import { cleanColor } from '../clean-color'
import { RegisterFormatter } from '../register-formatter'

RegisterFormatter((number_like: string, currency = 'USD', locale = 'en-US') => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
  })
  const float = parseFloat(cleanColor(number_like.toString())) || 0
  return formatter.format(float)
}, 'currency')
