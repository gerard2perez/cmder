import { describe, test, expect } from 'bun:test'
import { Ref, isRef, ref } from '@g2p/cmder/reactive/ref'

describe('ref', () => {
  test('contains a value key with the initialized value', () => {
    const inputs = [true, 10, 'hello']

    const results = inputs.map((input) => ref(input))

    for (let i = 0; i < results.length; i++) {
      expect(results[i]).toHaveProperty('value', inputs[i])
    }
  })

  test('detect a Ref variable', () => {
    expect(isRef(10)).toBe(false)
    expect(isRef(ref(10))).toBe(true)
    expect(isRef(new Ref(10))).toBe(true)
  })
})
