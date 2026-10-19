import randomNumber from './random-number'

export default function randomDigits(length: number, to: number) {
  const number = to > length ? randomNumber(length, to) : Math.round(Math.random() * parseInt(''.padStart(length, '9')))
  return `${number}`.padStart(length, '0')
}
