import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: [
    '**/__tests__/src/**/*.js',
    '**/__tests__/demo/**/*.js',
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
  ],
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/__tests__/styleMock.js',
    'react-syntax-highlighter/dist/esm/light':
      '<rootDir>/__tests__/reactSyntaxHighlighterMock.js',
    'react-syntax-highlighter/dist/esm/languages/hljs/(.*)':
      '<rootDir>/__tests__/hljsMock.js',
    '\\.svg$': '<rootDir>/__tests__/svgMock.js'
  }
};

export default config;
