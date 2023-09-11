import { arg, tag } from '@cmder'

const age: number = arg() ?? 10
const income: Income[] = tag('income', 'i', 'team member') ?? []
const demo: string = tag('demo', 'd', 'team member') ?? 'she'

console.log({ age, income, demo })

// await new Promise((resolve) => setTimeout(resolve, 5000))

// const { team, owner } = command<inputs>`[fcc] d: search for the current tag
//     [string] --team -t the team to look for tags
//     [string] --owner -o retired member of the team
//     [string] --name -n string contained on name`
