/* eslint-disable prettier/prettier */
import { GetFormatter } from './formatters'
function templateStringReducer(text: TemplateStringsArray, ...values: unknown[]) {
  return text.reduce((message, part, index) => {
    return `${message}${part}${values[index] || ''}`
  }, '')
}

const BRAKED_S = String.fromCharCode(0x01)
const BRAKED_E = String.fromCharCode(0x02)

export function textCompiler(text: TemplateStringsArray, ...values: unknown[]) {
  let fullText = templateStringReducer(text, ...values)
    .replaceAll('/{', BRAKED_S)
    .replaceAll('/}', BRAKED_E)
  const exp = /\{([^}{]*)\}/gm
  let result: RegExpExecArray

  while (fullText.includes('{')) {
    // eslint-disable-next-line no-cond-assign
    while ((result = exp.exec(fullText)!)) {
      const [full, fnWithPipes] = result
      const pipesWithArgs = fnWithPipes.split('|')
      let value = pipesWithArgs.shift()!
      for (const pipeWithArgs of pipesWithArgs) {
        const [pipeName, ...args] = pipeWithArgs.trim().split(':')
        const pipe = GetFormatter(pipeName)
        if (pipe) {
          value = pipe(value, ...args) /* istanbul ignore next */ || ''
        } else {
          value = full.replaceAll('{', BRAKED_S).replaceAll('}', BRAKED_E)
          break
        }
      }
      fullText = fullText.replace(full, value)
      exp.lastIndex = result.index + value.length
    }
  }
  // fullText = fullText.replaceAll(String.fromCharCode(0x03), '{')
  // fullText = fullText.replaceAll(String.fromCharCode(0x04), '}')
  return fullText
    .replaceAll(String.fromCharCode(0x01), '{')
    .replaceAll(String.fromCharCode(0x02), '}')
}
