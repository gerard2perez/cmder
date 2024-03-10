import { describe, test, expect } from 'bun:test'
import {
  waitInput,
  frameCompiler,
  simKeyInput,
} from '@g2p/cmder/readline/create-interface/create-interface-plus-plus.mock'
import { yesNoQuestion } from '@g2p/cmder/readline/yes-no-question'
import { textCompiler } from '@g2p/cmder/text-formatter/text-compiler'
import { OnDataEvents } from '@g2p/cmder/readline/create-interface/on-input-data'

describe('Yes/No Question', () => {
  test('Initial State', () => {
    yesNoQuestion('Hello')
    const frame = frameCompiler()

    expect(frame).toBe(textCompiler`{?|cyan} Hello: {›|gray} {No|cyan|underline} {/|gray} Yes`)
  })

  test('right arrow pressed', async () => {
    yesNoQuestion('Hello')
    simKeyInput(OnDataEvents.left_right, 1)
    const frame = frameCompiler()

    expect(frame).toBe(textCompiler`{?|cyan} Hello: {›|gray} No {/|gray} {Yes|cyan|underline}`)
  })

  test('choose No as answer', async () => {
    const result = yesNoQuestion('Hello')

    await waitInput()

    expect(result).resolves.toEqual(false)
  })

  test('choose Yes as answer', async () => {
    const result = yesNoQuestion('Hello')

    simKeyInput(OnDataEvents.left_right, 1)
    await waitInput()

    expect(result).resolves.toEqual(true)
  })
})
