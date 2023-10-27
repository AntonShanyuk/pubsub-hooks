module.exports = {
  preset: 'ts-jest',
  coverageDirectory: 'test-results',
  coverageThreshold: {
    './index.ts': {
      branches: 80,
    },
  },
  collectCoverageFrom: [
    './index.ts',
  ],
  reporters: [
    'default',
    [
      'jest-junit', {
        outputDirectory: './test-results/junit/',
        outputName: 'junit.xml',
      },
    ],
  ],
  watchPathIgnorePatterns: ['<rootDir>/node_modules/'],
  testEnvironment: 'jsdom',
};