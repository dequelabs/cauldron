import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';
import svgr from '@svgr/rollup';
import dynamicImportVar from 'rollup-plugin-dynamic-import-variables';

export default {
  input: 'src/index.ts',
  external: [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.peerDependencies)
  ],
  output: {
    dir: 'lib',
    format: 'cjs',
    // preserveModules: true,
    exports: 'auto'
  },
  plugins: [typescript(), commonjs(), svgr(), dynamicImportVar()]
};
