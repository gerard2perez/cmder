/* eslint-disable @typescript-eslint/no-explicit-any */
import chalk, { type ChalkInstance } from 'chalk'
import { RegisterFormatter } from '../register-formatter'

const Color = {
  black: 'black',
  red: 'red',
  green: 'green',
  yellow: 'yellow',
  blue: 'blue',
  magenta: 'magenta',
  cyan: 'cyan',
  white: 'white',
  blackBright: 'blackBright',
  grey: 'grey',
  gray: 'gray',
  redBright: 'redBright',
  greenBright: 'greenBright',
  yellowBright: 'yellowBright',
  blueBright: 'blueBright',
  magentaBright: 'magentaBright',
  cyanBright: 'cyanBright',
  whiteBright: 'whiteBright',
}
const Decoration = {
  rest: 'rest',
  bold: 'bold',
  dim: 'dim',
  italic: 'italic',
  underline: 'underline',
  inverse: 'inverse',
  hidden: 'hidden',
  strikethrough: 'strikethrough',
  visible: 'visible',
}
const Background = {
  bgBlack: 'bgBlack',
  bgRed: 'bgRed',
  bgGreen: 'bgGreen',
  bgYellow: 'bgYellow',
  bgBlue: 'bgBlue',
  bgMagenta: 'bgMagenta',
  bgCyan: 'bgCyan',
  bgWhite: 'bgWhite',
  bgBlackBright: 'bgBlackBright',
  bgGray: 'bgGray',
  bgGrey: 'bgGrey',
  bgRedBright: 'bgRedBright',
  bgGreenBright: 'bgGreenBright',
  bgYellowBright: 'bgYellowBright',
  bgBlueBright: 'bgBlueBright',
  bgMagentaBright: 'bgMagentaBright',
  bgCyanBright: 'bgCyanBright',
  bgWhiteBright: 'bgWhiteBright',
}
const chalkFns = [
  ...['rest', 'bold', 'dim', 'italic', 'underline', 'inverse', 'hidden', 'strikethrough', 'visible'],
  ...['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'],
  ...[
    'blackBright',
    'grey',
    'gray',
    'redBright',
    'greenBright',
    'yellowBright',
    'blueBright',
    'magentaBright',
    'cyanBright',
    'whiteBright',
  ],
  ...[
    'bgBlack',
    'bgRed',
    'bgGreen',
    'bgYellow',
    'bgBlue',
    'bgMagenta',
    'bgCyan',
    'bgWhite',
    'bgBlackBright',
    'bgGray',
    'bgGrey',
    'bgRedBright',
    'bgGreenBright',
    'bgYellowBright',
    'bgBlueBright',
    'bgMagentaBright',
    'bgCyanBright',
    'bgWhiteBright',
  ],
]
export const SolidColors = [Color.yellow, Color.green, Color.cyan, Color.magenta, Color.red, 'rgb:255:165:0']
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type Color = keyof typeof Color
export type Decoration = keyof typeof Decoration
export type Background = keyof typeof Background

for (const id of chalkFns) {
  const fn = function (text: string) {
    return (chalk[id as keyof ChalkInstance] as CallableFunction)(text)
  }
  RegisterFormatter(fn, id)
}
RegisterFormatter(function (text: string, r: string, g: string, b: string) {
  return chalk.rgb(parseInt(r), parseInt(g), parseInt(b))(text)
}, 'rgb')
