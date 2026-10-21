import { cleanColor } from '../clean-color'
import { RegisterFormatter } from '../register-formatter'

RegisterFormatter((text: string, _spaces: string, sym = ' ') => {
  const spaces = parseInt(_spaces)
  const colorsLenght = text.length - cleanColor(text).length
  return text.padStart(spaces + colorsLenght, sym)
}, 'padl')

RegisterFormatter((text: string, _spaces: string, sym = ' ') => {
  const spaces = parseInt(_spaces)
  const colorsLenght = text.length - cleanColor(text).length
  return text.padEnd(spaces + colorsLenght, sym)
}, 'padr')
