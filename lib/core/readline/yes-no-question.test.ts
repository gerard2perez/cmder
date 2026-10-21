import { waitInput, frameCompiler, simKeyInput } from './create-interface/create-interface-plus-plus.mock.test'
import { yesNoQuestion } from './yes-no-question'
import { textCompiler } from '../text-formatter/text-compiler'
import { OnDataEvents } from './create-interface/on-input-data'
import { describe, expect, test } from 'bun:test'
import { mockModule } from '../test/mock-module'

await mockModule('@g2p/cmder/readline/create-interface/create-interface-plus-plus')

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
