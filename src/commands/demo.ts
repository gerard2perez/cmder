import { arg, tag } from '@g2p/cmder'
import spinner from '../core/spinner/spinner'
import { computed } from '@g2p/cmder/spinner/context-object/computed'
import { withContext } from '@g2p/cmder/spinner/context-object/computed-context'

const age: number = arg() ?? 10
const income: Income[] = tag('income', 'i', 'team member') ?? []
const demo: string = tag('demo', 'd', 'team member') ?? 'she'
const doit: boolean = tag('do', 'o', 'do something') ?? false

const i = 0
let AGE = '{digits:1:254}'

const time = computed(10)
let j = 0
function tic() {
  return j++
}
setTimeout(() => {
  time.value = 15
}, 10)

const spinnerContext = withContext(
  { time, tic },
  ` {{frame}|cyan} Karl's
  "${i}" ${age} ${income} ${demo} :: ${doit ? 'true' : 'false'} {time}
  Your lucky number: ${AGE}
  MY NAME IS {{letters:5}|rgb:{digits:1:254}:{digits:1:254}:{digits:1:254}}
{tic|red}
  `,
)

export default async () => {
  const control = spinner(spinnerContext)
  setTimeout(() => {
    AGE = `${age}`
    control.done()
  }, 3000)
}
