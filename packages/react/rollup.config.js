import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';
import svgr from '@svgr/rollup';
import dynamicImportVar from '@rollup/plugin-dynamic-import-vars';

export default {
  input: 'src/index.ts',
  external: [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.peerDependencies)
  ],
  output: {
    dir: 'lib',
    format: 'cjs',
    exports: 'auto',
    chunkFileNames: '[name].js'
  },
  plugins: [
    typescript(),
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
