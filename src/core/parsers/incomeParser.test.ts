import incomeParser from './incomeParser'

describe('income parser', () => {
  test('parser correctly', () => {
    expect(incomeParser('10.5:0.50')).toEqual({ amount: 10.5, iva: 0.5 })
  })

  test('uses default value for iva', () => {
    expect(incomeParser('12')).toEqual({ amount: 12, iva: 0 })
  })
})
