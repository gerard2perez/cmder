import { GetFormatter } from './formatters'
function templateStringReducer(text: TemplateStringsArray, ...values: unknown[]) {
  return text.reduce((message, part, index) => {
    return `${message}${part}${values[index] || ''}`
  }, '')
}
export function textCompiler(text: TemplateStringsArray, ...values: unknown[]) {
  let fullText = templateStringReducer(text, ...values)
  const exp = /\{([^}{]*)\}/gm
  let result: RegExpExecArray

  while (fullText.includes('{'))
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
          value = full.replaceAll('{', String.fromCharCode(0x01)).replaceAll('}', String.fromCharCode(0x02))
          break
        }
      }
      fullText = fullText.replace(full, value)
      exp.lastIndex = result.index + value.length
    }
  return fullText.replaceAll(String.fromCharCode(0x01), '{').replaceAll(String.fromCharCode(0x02), '}')
}
