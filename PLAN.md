# Fix SkipLink: add `preventDefault` and `inline` variant (Option F)

**Issue:** [dequelabs/walnut#13823](https://github.com/dequelabs/walnut/issues/13823) (downstream consumer)

**PR(s):**

## Context

Cauldron's `<SkipLink>` has two design gaps that surface when used outside of a page header (e.g. inline after a combobox to skip a long list):

1. **Positioning** — Hardwired to `position: absolute; top: 11px; left: 11px`, which places the link at the viewport's top-left corner when there's no positioned ancestor. No prop or variant to opt into in-flow positioning.
2. **Double-activation** — `onClick` doesn't call `preventDefault()`. The anchor's default hash-navigation runs alongside the programmatic `element.focus()`. When the target is an interactive element (e.g. a `<button>`), this causes the target's click handler to fire — a bug that only manifests in real browsers, not in JSDOM tests.

### Key files

- `packages/react/src/components/SkipLink/index.tsx` — component
- `packages/styles/skip-link.css` — styles
- `packages/react/src/components/SkipLink/index.test.tsx` — tests
- `docs/pages/components/SkipLink.mdx` — documentation

## Plan

### 1. Add `preventDefault()` to `onClick` (Option D)

This is a one-line behavior fix. The component's purpose is to move focus to the target — the hash navigation is redundant because `element.focus()` already scrolls the target into view. Suppressing the default prevents double-activation when the target is interactive.

- [ ] **1a. Update `onClick` in `index.tsx`:**
  - Add `e: React.MouseEvent<HTMLAnchorElement>` parameter to the `onClick` method signature.
  - Call `e.preventDefault()` at the top of the method, before the `isBrowser()` check.
  - Update the `this.onClick = this.onClick.bind(this)` line if needed (signature is compatible, should be fine).

- [ ] **1b. Add regression test in `index.test.tsx`:**
  - Test: "should call preventDefault on click" — render the SkipLink, `fireEvent.click` the link, assert the event's `defaultPrevented` is `true`. Use `onClick` capture on a wrapper or check the return value of `fireEvent.click` (which returns `false` when `preventDefault` was called).

- [ ] **1c. Add regression test for interactive target:**
  - Test: "should not activate the target element when clicked" — render a SkipLink whose `target` is a `<button>` with an `onClick` spy. Click the skip link. Assert the button received focus but the spy was **not** called.

### 2. Add `variant` prop with `inline` option (Option E)

Follow the existing variant pattern used by Button, Link, and Alert: optional union-type prop, default value, classNames mapping.

- [ ] **2a. Add `variant` and `position` props to `SkipLinkProps` in `index.tsx`:**
  - Add `variant?: 'default' | 'inline'` to the `SkipLinkProps` interface.
  - Add `position?: { top?: string | number; right?: string | number; bottom?: string | number; left?: string | number }` to the interface. Only meaningful for the `inline` variant.
  - Default `variant` to `'default'` in `defaultProps` (or destructuring).
  - Pass variant-derived class to the `classNames` call on the `<nav>`: add `'SkipLink--inline': variant === 'inline'`.
  - When `position` is provided, apply its values as inline styles on the `<nav>` and add `position: absolute` to override the default `position: relative` of the inline variant. This lets the caller anchor the skip link to a specific spot (e.g. relative to another element's positioned container).

- [ ] **2b. Add `.SkipLink--inline` styles in `skip-link.css`:**

  The inline variant must overlay subsequent content (not push it down). The approach: the `<nav>` switches to `position: relative` and collapses to zero height with `overflow: visible`. This keeps the nav in normal document flow (so its position is determined by where it falls in the DOM, right after its previous sibling) but it takes up no space. The `<a>` inside is `position: absolute` relative to the nav, so it overlays from that point when focused.

  No special parent styling is required by default — the link appears right after its previous sibling. If the consumer passes the `position` prop, the nav switches to `position: absolute` with the provided offsets, allowing the caller to anchor it relative to a positioned ancestor.
  - Nav (the `<nav>` wrapper) — in flow, zero height, acts as positioning anchor:
    ```css
    .SkipLink.SkipLink--inline {
      position: relative;
      height: 0;
      width: 0;
      overflow: visible;
      padding: 0;
      top: auto;
      left: auto;
      opacity: 1;
    }
    ```
  - Link hidden state (sr-only, still tabbable):
    ```css
    .SkipLink.SkipLink--inline .SkipLink__link {
      position: absolute;
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      width: 1px;
      height: 1px;
      overflow: hidden;
      white-space: nowrap;
    }
    ```
  - Link active state (overlays from the nav's position):
    ```css
    .SkipLink.SkipLink--inline.SkipLink--active .SkipLink__link {
      clip: auto;
      clip-path: none;
      width: auto;
      height: auto;
      overflow: visible;
      white-space: normal;
      top: 0;
      left: 0;
    }
    ```
  - The fade transition (`.SkipLink--fade` with `opacity`) should still work since the inline nav already has `opacity: 1`. Verify this looks right and adjust if needed.

- [ ] **2c. Add tests for the inline variant in `index.test.tsx`:**
  - Test: "should render with SkipLink--inline class when variant is inline" — render with `variant="inline"`, assert the `<nav>` has class `SkipLink--inline`.
  - Test: "should not render SkipLink--inline class by default" — render without variant, assert the `<nav>` does not have `SkipLink--inline`.
  - Test: "inline variant should add active class on focus" — render with `variant="inline"`, focus the link, assert `SkipLink--active` is present.
  - Test: "inline variant should apply position styles when position prop is provided" — render with `variant="inline"` and `position={{ top: 10, left: 20 }}`, assert the `<nav>` has `position: absolute` and the corresponding top/left inline styles.

- [ ] **2d. Update documentation in `SkipLink.mdx`:**
  - Add a section for the `inline` variant with an example and explanation of when to use it (e.g. "Use `variant="inline"` when placing a SkipLink within page content rather than at the top of the page").
  - Update the props table to include `variant`.

### 3. Verify

- [ ] **3a.** Run SkipLink tests: `yarn --cwd=packages/react test SkipLink`
- [ ] **3b.** Run full test suite: `yarn test`
- [ ] **3c.** Run lint: `yarn lint`
- [ ] **3d.** Visual verification: `yarn dev`, navigate to the SkipLink docs page, Tab to the skip link, verify:
  - Default variant: appears at top-left as before
  - Inline variant: overlays on top of subsequent content when focused, hidden when blurred, does not push content down
  - Both variants: clicking moves focus to target without triggering the target's click handler
