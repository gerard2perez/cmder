/* eslint-disable @typescript-eslint/no-explicit-any */
import { arg, tag } from '@g2p/cmder'
import spinner from '@g2p/cmder/spinner/spinner'
import { ref } from '@g2p/cmder/reactive/ref'
import { withContext } from '@g2p/cmder/reactive/computed-context'

const age: number = arg() ?? 10
const income: Income[] = tag('income', 'i', 'team member') ?? []
const demo: string = tag('demo', 'd', 'team member') ?? 'she'
const doit: boolean = tag('do', 'o', 'do something') ?? false

const i = 0
const AGE = '{digits:1:254}'

const time = ref(10)
let j = 0
function tic() {
  return j++
}
setTimeout(() => {
  time.value = 15
}, 10)

export default async () => {
  const control = spinner(
    { time, tic },
    ` {{frame}|cyan} Karl's
    "${i}" ${age} ${income} ${demo} :: ${doit ? 'true' : 'false'} {time}
    Your lucky number: ${AGE}
    MY NAME IS {{letters:5}|rgb:{digits:1:254}:{digits:1:254}:{digits:1:254}}
  {tic|red}
    `,
  )
  setTimeout(() => {
    //   AGE = `${age}`
    control.done('Done')
  }, 30000)
  // const control = spinner(withContext({ variable }, `{?|cyan} Project name: {variable}`))
  // type Data = {
  //   hello: boolean
  // }
}
