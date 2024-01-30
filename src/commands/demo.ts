import { arg, tag } from '@g2p/cmder'
import spinner from '../core/spinner/spinner'

const age: number = arg() ?? 10
const income: Income[] = tag('income', 'i', 'team member') ?? []
const demo: string = tag('demo', 'd', 'team member') ?? 'she'
const doit: boolean = tag('do', 'o', 'do something') ?? false

const i = 0
let AGE = '{digits:1:254}'
export default async () => {
  const control = spinner(function r() {
    return `{{frame}|cyan} Karl's
    "${i}" ${age} ${income} ${demo} :: ${doit ? 'true' : 'false'}
    Your lucky number: ${AGE}
    MY NAME IS {{letters:5}|rgb:{digits:1:254}:{digits:1:254}:{digits:1:254}}
    `
  })
  setTimeout(() => {
    AGE = `${age}`
    control.done()
  }, 30)
}
