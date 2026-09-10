/**
 * Normalizes a CommonJS default export.
 *
 * Under strict ESM (Next.js SSR, webpack 5, Node-native) a CommonJS dependency
 * that sets `__esModule` is delivered double-wrapped (`{ __esModule, default }`),
 * so a `default` import resolves to the wrapper rather than the value — calling
 * it (or reading a static off it) then throws. Bundlers like Vite already
 * unwrap this, so it is a no-op there.
 *
 * Use for `default` imports of CJS dependencies that ship `__esModule` (e.g.
 * `react-id-generator`, `react-syntax-highlighter`). Plain CJS dependencies
 * (`module.exports = fn`, no `__esModule`) such as `classnames` don't need it.
 */
export default function interopDefault<T>(mod: T): T {
  return (mod as { __esModule?: boolean; default?: T })?.__esModule
    ? (mod as { default: T }).default
    : mod;
}
