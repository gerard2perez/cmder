import booleanParser from './booleanParser'

describe('boolean parser', () => {
  test('parser correctly true', () => {
    expect(booleanParser('true')).toEqual(true)
  })

  test('parser correctly false', () => {
    expect(booleanParser('false')).toEqual(false)
  })

  test('uses default value for iva', () => {
    expect(booleanParser('')).toEqual(false)
  })
})
