import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: [
    '**/src/components/**/*.test.tsx',
    '**/src/utils/**/*.test.{ts,tsx}',
    '**/src/contexts/**/*.test.tsx',
    '!**/src/utils/polymorphicComponent.test.tsx'
  ],
  collectCoverageFrom: [
    '<rootDir>/src/components/**/*.{tsx,ts}',
    '<rootDir>/src/utils/**/*.{tsx,ts}',
    '<rootDir>/src/contexts/**/*.{tsx,ts}',
    '!<rootDir>/src/utils/polymorphicComponent.test.tsx'
  ]
};

export default config;
