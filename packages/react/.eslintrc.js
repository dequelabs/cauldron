module.exports = {
  extends: ['../../.eslintrc.js', 'plugin:ssr-friendly/recommended'],
  plugins: ['ssr-friendly'],
  overrides: [
    {
      files: ['__tests__/**/*', '**/*/*.test.{j,t}sx', 'src/setupTests.ts'],
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
      files: ['src/utils/polymorphicComponent.ts'],
      rules: {
        '@typescript-eslint/ban-types': 'off'
      }
    }
  ]
};
