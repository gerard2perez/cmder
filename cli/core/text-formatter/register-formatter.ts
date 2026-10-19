type FormatterFn = (text: string, ...args: string[]) => string
const Formatters = new Map<string, FormatterFn>()
export function RegisterFormatter(fn: FormatterFn, name: string) {
  Formatters.set(name, fn)
}
export function GetFormatter(formatter: string) {
  return Formatters.get(formatter)
}
