export default {
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  coveragePathIgnorePatterns: ['node_modules', '<rootDir>/src/index.ts'],
  moduleNameMapper: {
    '~/tests/(.+)': '<rootDir>/__tests__/$1',
    '~/(.+)': '<rootDir>/src/$1'
  },
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  transform: {
    '\\.ts$': 'ts-jest'
  }
}
