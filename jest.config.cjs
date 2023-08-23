/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  verbose: true,
  preset: 'ts-jest/presets/default-esm',
  transform: {},
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageReporters: ['json', 'lcov', 'text-summary', 'clover', 'text'],
  reporters: ['default'],
  coveragePathIgnorePatterns: ['src/index.ts', 'src/meta-loader.ts'],
  extensionsToTreatAsEsm: ['.ts'],
}
