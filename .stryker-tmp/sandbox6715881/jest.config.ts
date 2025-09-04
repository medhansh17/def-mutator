module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ['**/?(*.)+(spec|test).+(ts)'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest'
  },
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  testPathIgnorePatterns: ["node_modules"],
  coveragePathIgnorePatterns: ["node_modules"],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },
  moduleDirectories: ['node_modules', 'src'],
  coverageReporters: [
    'text',
    'lcov'
  ]
}
