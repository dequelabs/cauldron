module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: [
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  plugins: ['react', 'jsx-a11y', '@typescript-eslint'],
  rules: {
    'jsx-a11y/label-has-for': [
      2,
      {
        allowChildren: true
      }
    ],
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/ban-ts-comment': 'warn'
  },
  settings: {
    react: {
      version: '16'
    }
  },
  overrides: [
    {
      files: '**/*/__tests__/**/*.js',
      globals: {
        jest: true,
        test: true,
        expect: true,
        afterEach: true,
        afterAll: true,
        beforeEach: true,
        beforeAll: true
      }
    },
    { files: '*.js', rules: { '@typescript-eslint/no-var-requires': 'off' } }
  ]
};
