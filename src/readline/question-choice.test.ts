import {
  waitInput,
  frameCompiler,
  simKeyInput,
} from '@g2p/cmder/readline/create-interface/create-interface-plus-plus.mock.test'
import { QuestionChoice } from '@g2p/cmder/readline/question-choice'
import { textCompiler } from '@g2p/cmder/text-formatter/text-compiler'
import { OnDataEvents } from '@g2p/cmder/readline/create-interface/on-input-data'
import { viteBulletOff, viteBulletOn } from '@g2p/cmder/readline/bullets/vite-bullets'
import { nuxtBulletOff, nuxtBulletOn } from '@g2p/cmder/readline/bullets/nuxt-bullet'
import { describe, expect, test } from 'bun:test'
import { mockModule } from '@g2p/cmder/test/mock-module'

await mockModule('@g2p/cmder/readline/create-interface/create-interface-plus-plus')

const compileExpectedFrame = ({ header = '', on = viteBulletOn, off = viteBulletOff, options = ['a'], index = 0 }) =>
  textCompiler`{?|cyan} ${header}: {›|gray} {- Use arrow-keys. Enter to submit|gray}\n` +
  (options as string[])
    .map((opt, i) => (i === index ? on(opt, i) : off(opt, i)))
    .map((r) => textCompiler`${r}`)
    .join('\n')

describe('Question Choice', () => {
  test('Initial State', () => {
    QuestionChoice('Hello', {
      elements: ['a', 'b', 'c'],
    })
    const frame = frameCompiler()
    const expectedFrame = compileExpectedFrame({
      header: 'Hello',
      options: ['a', 'b', 'c'],
    })

    expect(frame).toBe(expectedFrame)
  })

  test('Arrow keys pressed', () => {
    QuestionChoice('Hello', {
      elements: ['a', 'b', 'c'],
    })

    simKeyInput(OnDataEvents.up_down, 1)
    simKeyInput(OnDataEvents.up_down, 1)
    simKeyInput(OnDataEvents.up_down, -1)

    const frame = frameCompiler()
    const expectedFrame = compileExpectedFrame({
      header: 'Hello',
      options: ['a', 'b', 'c'],
      index: 1,
    })

    expect(frame).toBe(expectedFrame)
  })

  test('Selects option two', async () => {
    const result = QuestionChoice('Hello', {
      elements: ['a', 'b', 'c'],
    })

    simKeyInput(OnDataEvents.up_down, 1)
    await waitInput()

    expect(result).resolves.toEqual('b')
  })

  test('Personalize prompt', () => {
    enum Options {
      a,
      b,
      c,
    }
    QuestionChoice('Hello', {
      elements: Options,
      SelectedBullet: nuxtBulletOn,
      UnSelectedBullet: nuxtBulletOff,
    })

    simKeyInput(OnDataEvents.up_down, 1)
    simKeyInput(OnDataEvents.up_down, 1)
    simKeyInput(OnDataEvents.up_down, -1)

    const frame = frameCompiler()
    const expectedFrame = compileExpectedFrame({
      header: 'Hello',
      options: ['a', 'b', 'c'],
      on: nuxtBulletOn,
      off: nuxtBulletOff,
      index: 1,
    })

    expect(frame).toBe(expectedFrame)
  })
})
