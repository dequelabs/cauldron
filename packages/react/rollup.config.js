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
    // Use `named` (rather than `auto`) so every preserved module exposes its
    // exports the same way — components with a default export are reached via
    // `.default`, matching the emitted `.d.ts` and esModuleInterop. `auto`
    // would make default-only modules `module.exports = X` while mixed modules
    // stay `.default`, giving inconsistent deep-import ergonomics.
    exports: 'named',
    // Emit one file per source module (mirroring the src/ tree) instead of a
    // single bundled barrel. This lets consumers deep-import a single
    // component (e.g. `@deque/cauldron-react/Modal`) and have their
    // bundler prune every other component — and its transitive dependencies —
    // they don't use. See dequelabs/cauldron#2465.
    preserveModules: true,
    preserveModulesRoot: 'src',
    chunkFileNames: '[name].js'
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      exclude: [
        '**.test.ts',
        '**.test.tsx',
        '**.figma.tsx',
        '**.stories.tsx',
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
