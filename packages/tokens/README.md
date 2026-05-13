# @deque/cauldron-tokens

Design tokens for cauldron, authored as JSON and built with [Style Dictionary](https://styledictionary.com/).

> **Status: skeleton.** Only the color slice is implemented end-to-end. Other token categories (spacing, text size, z-index, dimensions, drop shadows) still live in [`packages/styles/variables.css`](../styles/variables.css). The migration of the rest is tracked in the **TODO** section below.

## Why this package exists

Today, cauldron's design tokens live as hand-maintained CSS custom properties in `packages/styles/variables.css`. Moving the source of truth to typed JSON lets us:

1. Sync tokens with the [Figma Tokens Studio](https://tokens.studio/) plugin, so designers can change a value in Figma and open a PR.
2. Emit the same tokens in additional formats later (TypeScript/JS for runtime use, JSON for downstream tools) without re-typing them.
3. Keep the existing CSS API stable — generated `variables.css` produces the same `--gray-20`, `--accent-primary`, etc. consumers already depend on.

The skeleton in this directory proves the build pipeline works for one token category. It does **not** yet replace `packages/styles/variables.css`.

## Layout

```
packages/tokens/
├── package.json
├── style-dictionary.config.js     # Single platform; emits dist/variables.css
├── src/
│   ├── $metadata.json             # Tokens Studio set order
│   ├── $themes.json               # Tokens Studio theme definitions (single 'Default' theme today)
│   ├── core/
│   │   └── color.json             # Raw palette + literal-valued accents
│   └── semantic/
│       └── color.json             # Aliases referencing core
└── dist/                          # Generated. Not committed.
    └── variables.css
```

### Why the JSON is shaped the way it is

The desired output names (`--gray-20`, `--text-color-base`) are flat and hyphenated, which doesn't match the nested structure Tokens Studio prefers. To preserve the existing CSS API with no custom transforms, the JSON paths are arranged so the default `name/kebab` transform produces the right name:

- `gray.20` → `--gray-20`
- `accent.primary` → `--accent-primary`
- `accent.primary-active` → `--accent-primary-active` (hyphen at the leaf, not another nesting level, because `accent.primary` is itself a token)
- `text-color.base` → `--text-color-base`

The `focus` tokens (`focus-light`, `focus-dark`, `focus-active`, `focus-glow`) are flat at the top level rather than nested under `focus.*` because there is also a semantic `focus` alias — DTCG does not allow a node to be both a token and a group.

## Build

```sh
yarn install
yarn build
```

This emits `dist/variables.css`. Diff it against the colors section of `packages/styles/variables.css` (lines 8–76) to confirm parity.

## Tokens Studio sync (not wired yet)

The `$metadata.json` and `$themes.json` files are the integration points for the [Figma Tokens Studio plugin](https://tokens.studio/). To enable design→code sync later:

1. In the Tokens Studio plugin, configure GitHub sync pointing at `packages/tokens/src/` on a branch.
2. Designers push from Figma; the plugin opens PRs against this directory.
3. CI runs `yarn build` and includes the resulting `variables.css` diff in the PR for review.

The skeleton stops short of the plugin config — it's a setup step that needs Figma admin access, not code.

## TODO

Decisions to resolve before this replaces `packages/styles/variables.css`:

- [ ] **Migrate remaining token categories.** Spacing, text size, fonts, icon sizes, dimensions, z-index, target size, drop shadows. Each is one JSON file in `src/core/` or `src/semantic/`.
- [ ] **Decide on rgba values.** `--focus-active` and `--focus-glow` are derived from `--focus-light` with alpha. Either keep them as raw rgba strings (current skeleton) or model them as `{focus-light}` references with an alpha modifier via [`@tokens-studio/sd-transforms`](https://github.com/tokens-studio/sd-transforms).
- [ ] **Handle the `.cauldron--theme-dark` block.** Today it overrides one variable (`--focus`). Approach: add `src/themes/dark.json`, configure a second Style Dictionary platform with `selector: '.cauldron--theme-dark'`.
- [ ] **Composite values.** `--space-large-with-underborder: 18px 24px` and `--drop-shadow-overlay` (multi-shadow) are valid CSS shorthand but unusual as design tokens. Decide whether to model them as `$type: shadow` structured objects or keep as raw strings.
- [ ] **`calc()` tokens.** `--z-index-skip-container: calc(var(--z-index-top-bar) + 1)`. Stays as a raw string value; Tokens Studio will surface it as untyped.
- [ ] **Group comments.** The `/* color palette */`, `/* spacing */`, etc. section headers in `variables.css` are not reproduced by Style Dictionary. Either accept this or add a postprocess step that injects them.
- [ ] **Output banner.** Add a "generated, do not edit" comment to `dist/variables.css` once it replaces the hand-maintained file.
- [ ] **Wire into `packages/styles` output.** Currently `packages/styles/index.css` imports `./variables.css`. Switch this to import from `@deque/cauldron-tokens/dist/variables.css` (or have Style Dictionary write directly to `packages/styles/variables.css`) once the full token set is migrated.
- [ ] **Tokens Studio plugin config.** GitHub sync, branch strategy, designer workflow doc.
- [ ] **Publish or keep private.** Currently `"private": true`. If downstream consumers want to import tokens directly (not via the CSS), flip this and version it alongside `@deque/cauldron-styles`.

## Build wiring

`packages/styles/package.json` runs `yarn --cwd=../tokens build` before its own `build` step, so a styles build will fail loudly if the token build is broken. The generated `dist/variables.css` from this package is **not** yet consumed by the styles output — that swap is the last TODO item above.
