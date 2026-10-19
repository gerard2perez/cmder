import { afterAll, mock } from 'bun:test'

/**
 *
 * @param modulePath - the path starting from this files' path.
 * @param renderMocks - function to generate mocks (by their named or default exports)
 * @returns an object
 */
export const mockModule = async (modulePath: string, renderMocks?: () => Record<string, unknown>) => {
  const original = {
    ...(await import(modulePath)),
  }
  const mocks = await import(`${modulePath}.mock.test`)
    .then((m) => m.default)
    .catch(() => {
      if (renderMocks) {
        return renderMocks()
      }
      return {}
    })

  const result = {
    ...original,
    ...mocks,
  }
  mock.module(modulePath, () => result)
  afterAll(() => {
    mock.module(modulePath, () => original)
  })
}
