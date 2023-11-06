/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coverageThreshold: {
    './index.ts': {
      branches: 80,
    },
  },
};