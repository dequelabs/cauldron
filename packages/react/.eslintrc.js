// These CJS dependencies ship `__esModule`, so their default imports come back
// double-wrapped under strict ESM. Each is allowed only in the one module that
// unwraps it with `interopDefault`.
const reactIdGeneratorDefault = {
  name: 'react-id-generator',
  importNames: ['default'],
  message: "Import nextId from 'utils/nextId', which unwraps it for strict ESM."
};

module.exports = {
  extends: ['../../.eslintrc.js', 'plugin:ssr-friendly/recommended'],
  plugins: ['ssr-friendly'],
  overrides: [
    {
      files: ['**/*/*.test.{j,t}sx', 'src/setupTests.ts'],
      rules: {
        'ssr-friendly/no-dom-globals-in-module-scope': 'off',
        'ssr-friendly/no-dom-globals-in-constructor': 'off',
        'ssr-friendly/no-dom-globals-in-react-cc-render': 'off',
        'ssr-friendly/no-dom-globals-in-react-fc': 'off',
        'react/display-name': 'off'
      }
    },
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off'
      }
    },
    {
      files: ['src/**/*.{ts,tsx}'],
      excludedFiles: [
        'src/utils/nextId.ts',
        'src/components/Code/index.tsx',
        'src/react-syntax-highlighter.d.ts'
      ],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              reactIdGeneratorDefault,
              {
                name: 'react-syntax-highlighter',
                importNames: ['default'],
                message:
                  'Its default export needs interopDefault; keep these imports in Code/index.tsx.'
              }
            ],
            patterns: [
              {
                group: ['react-syntax-highlighter/**'],
                message:
                  'Its default exports need interopDefault; keep these imports in Code/index.tsx.'
              }
            ]
          }
        ]
      }
    },
    {
      files: ['src/components/Code/index.tsx'],
      rules: {
        'no-restricted-imports': ['error', { paths: [reactIdGeneratorDefault] }]
      }
    }
  ]
};
