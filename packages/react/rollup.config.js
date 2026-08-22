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
 * Writes `{"type": "module"}` into the ESM output directory so Node reads its
 * plain `.js` files as ESM. Only the ESM build needs this: the package declares
 * no top-level `type`, so `.js` already means CommonJS everywhere else.
 *
 * It also re-declares `sideEffects: false`. Bundlers read that flag from the
 * `package.json` *nearest* the module, so this marker would otherwise shadow the
 * root manifest and every emitted ESM module would fall back to "assumed to have
 * side effects" — defeating the tree-shaking configured below.
 */
function emitEsmTypeMarker() {
  return {
    name: 'emit-esm-type-marker',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'package.json',
        source: `${JSON.stringify(
          { type: 'module', sideEffects: false },
          null,
          2
        )}\n`
      });
    }
  };
}

/**
 * Each build compiles from source independently so its output matches the module
 * kind it declares. Declarations are emitted only once, by the CJS build — see
 * the `declaration` option below.
 */
function build({ format, dir }) {
  const isEsm = format === 'es';

  return {
    input: 'src/index.ts',
    external,
    output: {
      dir,
      format,
      // The public entry is the named-export barrel; per-module files expose
      // their component as the `default` export (with `__esModule`) for interop.
      exports: 'named',
      // Preserve the source module graph (one output file per source module,
      // mirroring src/) instead of bundling everything into index.js. Combined
      // with `sideEffects` (the root manifest for the CJS tree, the emitted
      // marker for the ESM tree), this is what lets a consumer's bundler drop
      // unused components — e.g. a Button-only import excludes Code and its
      // react-syntax-highlighter dependency.
      preserveModules: true,
      preserveModulesRoot: 'src',
      entryFileNames: '[name].js'
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        // Only the CJS build emits declarations. `types` points at that one tree
        // and nothing exposes `lib/esm` to a type resolver, so a second copy
        // would be both unreachable and invalid where it sat: its relative
        // specifiers are extensionless, which is a TS2835 error for a directory
        // marked `{"type": "module"}` under `moduleResolution` node16/nodenext.
        declaration: !isEsm,
        ...(isEsm ? {} : { declarationDir: dir }),
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
      // CJS gets no marker on purpose: one at `lib/` would shadow the root
      // manifest's `sideEffects`, and a consumer's bundler could then drop
      // `lib/cauldron.css`.
      ...(isEsm ? [emitEsmTypeMarker()] : [])
    ]
  };
}

// The CJS build keeps the historical `lib/` layout so published deep paths
// (`@deque/cauldron-react/lib/components/<Name>` and `/lib/types`, which
// consumers import types from) keep resolving; the ESM build nests under it.
export default [
  build({ format: 'cjs', dir: 'lib' }),
  build({ format: 'es', dir: 'lib/esm' })
];
