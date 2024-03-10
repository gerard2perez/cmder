import { describe, test, expect } from 'bun:test'
import { withContext } from '@g2p/cmder/reactive/computed-context'
import { ref } from '@g2p/cmder/reactive/ref'

describe('Computed Context', () => {
  test('export two named functions', () => {
    const result = withContext({}, '')

    expect(result).toHaveProperty('createContext')
    expect(result.createContext).toBeTypeOf('function')
    expect(result).toHaveProperty('frame')
    expect(result.frame).toBeTypeOf('function')
  })

  test('Context is correctly built', () => {
    const { createContext } = withContext(
      {
        prop: 10,
        refProp: ref(2),
        // @ts-expect-error TODO: work on this type
        functionalProp: ({ prop, refProp }) => prop * refProp,
      },
      '',
    )

    expect(createContext()).toEqual({ prop: 10, refProp: 2 })
  })

  test('Frame render a string which can be compiled', () => {
    const { frame } = withContext(
      {
        prop: 10,
        refProp: ref(2),
        // @ts-expect-error TODO: work on this type
        functionalProp: ({ prop, refProp }) => prop * refProp,
      },
      '{prop}*{refProp}={functionalProp|cyan}',
    )

    expect(frame()).toBe('{10}*{2}={20|cyan}')
  })
})
