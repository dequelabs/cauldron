import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';
import svgr from '@svgr/rollup';
import dynamicImportVar from '@rollup/plugin-dynamic-import-vars';

export default {
  input: 'src/index.ts',
  external: [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.peerDependencies),
    // Note: We directly import only the specific language syntax needed
    // directly in the Code component. This ensures it is still treated as
    // an external dependency since it won't match the dependencies or
    // peerDependencies when pulled from package.json.
    /^react-syntax-highlighter/
  ],
  output: {
    dir: 'lib',
    format: 'cjs',
    exports: 'auto',
    chunkFileNames: '[name].js'
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      exclude: [
        '**.test.ts',
        '**.test.tsx',
        './src/setupTests.ts',
        './src/axe.ts'
      ]
    }),
    commonjs(),
    svgr({
      svgoConfig: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false
              }
            }
          },
          {
            name: 'removeDimensions',
            params: {
              active: true
            }
          },
          {
            name: 'addAttributesToSVGElement',
            params: {
              attributes: [{ height: 24 }, { width: 24 }]
            }
          }
        ]
      }
    }),
    dynamicImportVar()
  ]
};
