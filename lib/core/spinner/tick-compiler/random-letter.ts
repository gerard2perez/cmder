import randomNumber from './random-number'

export default function randomLetter(length: number) {
  let letters = ''
  while (length--) {
    letters += String.fromCharCode(randomNumber('A'.charCodeAt(0), 'Z'.charCodeAt(0)))
  }
  return letters
}
