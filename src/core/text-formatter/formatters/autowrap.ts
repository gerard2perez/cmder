import { RegisterFormatter } from '../register-formatter'
// this is another comment
const wordWrap = (size: number) => new RegExp(`([^\\n]{1,${size}})(\\s|$)`, 'g')
/**
 * This is a comment
 */
RegisterFormatter((text: string = '', size: string = '0') => {
  const start = parseInt(size)
  let width = 80
  try {
    width = process.stdout.getWindowSize()[0]
  } catch (ex) {
    void 0
  }

  const fixedWidth = width - start
  let result = ((text || '').match(wordWrap(fixedWidth)) as string[]) || [text]
  result = result.map((line, i) => {
    line = line.trim()
    const spacesNeeded = fixedWidth - line.length
    const shouldFill = i !== result.length - 1
    const currentSpaces = (line.match(/\w\b/g) || []).length - 1
    if (shouldFill && spacesNeeded > 0 && currentSpaces > 0) {
      const insertNSpaces = Math.floor(spacesNeeded / currentSpaces)
      const leftSpaces = spacesNeeded % currentSpaces
      line = line
        .split(' ')
        .map((word, i) => word + ''.padEnd(insertNSpaces + (i < leftSpaces ? 1 : 0), ' '))
        .join(' ')
        .trimEnd()
    }
    return line
  }) as string[]
  return result ? result.map((l, i) => (i ? ''.padStart(start, ' ') : '') + l).join('\n') : text.padStart(start, ' ')
}, 'autowrap')
