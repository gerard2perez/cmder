import numberParser from './numberParser'

describe('number parser', () => {
  test('parser correctly', () => {
    expect(numberParser('10.5')).toBe(10.5)
  })
})
