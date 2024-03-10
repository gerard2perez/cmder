import { ref } from '@g2p/cmder/spinner/spinner'
/**
 * Handles common states used inside readLinePlusPlus
 */
export function statusManager() {
  const ended = ref(false)
  let succeeded = false
  function status() {
    const icon = ended.value ? (succeeded ? '✔' : '✖') : '?'
    const color = ended.value ? (succeeded ? 'green' : 'red') : 'cyan'
    return `{${icon}|${color}}`
  }
  function indicator() {
    const icon = ended.value ? '…' : '›'
    return `{${icon}|gray}`
  }
  function commit(data: string | null | undefined): string | undefined {
    ended.value = true
    if (data === null) {
      succeeded = false
      return undefined
    } else {
      succeeded = true
      return data
    }
  }
  return { status, commit, ended, indicator }
}
