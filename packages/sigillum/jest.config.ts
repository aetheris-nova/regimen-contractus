import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'ts'],
  moduleNameMapper: {
    '@client(.*)': '<rootDir>/src/client/$1',
  },
  rootDir: '.',
  testEnvironment: 'node',
  testTimeout: 60000,
  testMatch: ['<rootDir>/src/client/**/*.test.ts'],
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.test.json',
      },
    ],
  },
  verbose: true,
};

export default config;
