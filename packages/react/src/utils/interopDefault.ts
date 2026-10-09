/**
 * Normalizes a CommonJS default export.
 *
 * Under strict ESM (Node-native ESM, and webpack 5 loading the `lib/esm` build,
 * both run by `verify:packaging`) a CommonJS dependency that sets `__esModule` is
 * delivered double-wrapped (`{ __esModule, default }`), so a `default` import
 * resolves to the wrapper rather than the value, and calling it (or reading a
 * static off it) throws. Where the default is already unwrapped, this returns
 * it unchanged.
 *
 * Use for `default` imports of CJS dependencies that ship `__esModule` (e.g.
 * `react-id-generator` via `utils/nextId`, `react-syntax-highlighter` in Code).
 * Plain CJS dependencies (`module.exports = fn`, no `__esModule`) such as
 * `classnames` don't need it.
 */
export default function interopDefault<T>(mod: T): T {
  return (mod as { __esModule?: boolean; default?: T })?.__esModule
    ? (mod as { default: T }).default
    : mod;
}
