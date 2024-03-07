import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: [
    '**/__tests__/src/**/*.js',
    '**/__tests__/demo/**/*.js',
    '**/src/components/**/*.test.tsx',
    '**/src/utils/**/*.test.ts'
  ],
  collectCoverageFrom: ['<rootDir>/src/components/**/*.{tsx,ts}'],
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
