import { statusManager } from '@g2p/cmder/readline/readline-plus-plus/status-manager'
import { describe, test, expect } from 'bun:test'

describe('Default event handler to control prompt behavior', () => {
  const { commit, indicator, status } = statusManager()
  test('Renders states when not ended', () => {
    expect(status()).toBe(`{?|cyan}`)
    expect(indicator()).toBe(`{›|gray}`)
  })

  test('Commits a failed value', () => {
    commit(null)
    expect(status()).toBe(`{✖|red}`)
    expect(indicator()).toBe(`{…|gray}`)
  })

  test('Commits a success value', () => {
    commit('success')
    expect(status()).toBe(`{✔|green}`)
    expect(indicator()).toBe(`{…|gray}`)
  })
})
