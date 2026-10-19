import { SolidColors } from '../../core/text-formatter/formatters'

export const pickColor = (opt: string, index: number) => {
  return `{${opt}|${SolidColors[index % SolidColors.length]}}`
}
export function viteBulletOn(option: string, index: number) {
  return `{${'❯'}|cyan}   {${pickColor(option, index)}|underline}`
}
export function viteBulletOff(option: string, index: number) {
  return `    ${pickColor(option, index)}`
}
