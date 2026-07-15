import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';
import svgr from '@svgr/rollup';
import dynamicImportVar from '@rollup/plugin-dynamic-import-vars';

const external = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies),
  // Note: We directly import only the specific language syntax needed
  // directly in the Code component. This ensures it is still treated as
  // an external dependency since it won't match the dependencies or
  // peerDependencies when pulled from package.json.
  /^react-syntax-highlighter/
];

const svgrOptions = {
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
};

/**
 * Writes a `package.json` into an output directory whose only job is to mark
 * the module kind of the emitted `.js` files (e.g. `{"type": "module"}` for the
 * ESM output). This lets us keep plain `.js` extensions in both builds while
 * Node still resolves each one as the correct module system.
 */
function emitTypeMarker(type) {
  return {
    name: 'emit-type-marker',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'package.json',
        source: `${JSON.stringify({ type }, null, 2)}\n`
      });
    }
  };
}

/**
 * Each build compiles from source independently so that its `.d.ts` files land
 * beside its `.js` files and are interpreted with the matching module kind —
 * this keeps `@arethetypeswrong/cli` happy (no types/runtime "masquerading").
 */
function build({ format, dir, type }) {
  return {
    input: 'src/index.ts',
    external,
    output: {
      dir,
      format,
      exports: 'auto',
      chunkFileNames: '[name].js'
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: dir,
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
      svgr(svgrOptions),
      dynamicImportVar(),
      emitTypeMarker(type)
    ]
  };
}

export default [
  build({ format: 'cjs', dir: 'lib/cjs', type: 'commonjs' }),
  build({ format: 'es', dir: 'lib/esm', type: 'module' })
];
