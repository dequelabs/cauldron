---
name: connect-component-to-figma
description: Add a Figma Code Connect (.figma.tsx) file for a Cauldron React component, following the conventions and gotchas from the batch 1-5 rollout (issue dequelabs/cauldron#2373). Use when the user says "connect <Component> to Figma", "add a code connect for <Component>", "add a .figma.tsx", or works on Figma Code Connect tasks in the cauldron repo.
model: sonnet
---

# Connect a Cauldron component to Figma

Adds one `.figma.tsx` file next to a `packages/react/src/components/<Component>/` source file so the Figma Dev Mode snippet shows the real Cauldron API. Reference implementations: `IconButton.figma.tsx` (nested props), `Tooltip.figma.tsx` (anchored target+ref), `Checkbox.figma.tsx` (multiple enums + boolean + textContent).

## Quick start

```tsx
import React from 'react';
import figma from '@figma/code-connect';
import { MyComponent } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=NODE-ID&m=dev';

figma.connect(MyComponent, FIGMA_URL, {
  props: {
    // VARIANTs (including pseudo-booleans like "True"/"False"):
    variant: figma.enum('Variant', { Secondary: 'secondary' }),
    // Real BOOLEANs:
    disabled: figma.boolean('Disabled', { true: true, false: undefined }),
    // Text layers:
    children: figma.textContent('Label')
  },
  example: ({ variant, disabled, children }) => (
    <MyComponent variant={variant} disabled={disabled}>
      {children}
    </MyComponent>
  )
});
```

Replace `NODE-ID` with the Figma node id in the form `123-456` (dash, not colon).

## Workflow

1. **Confirm the Figma node id.** Ask the user if not given. Convert `123:456` → `123-456` for the URL.
2. **Verify the React API.**
   - Read `packages/react/src/index.ts` to confirm the named export(s). Many components have compound children (e.g. `AccordionTrigger`, `BreadcrumbLink`, `PanelTrigger`) — import them from the barrel.
   - Read the component's `index.tsx` / main `.tsx` to find required props and the real shape of any child components.
3. **Write the file** at `packages/react/src/components/<Component>/<Component>.figma.tsx`. Use the Quick start template.
4. **Lint + validate**:
   ```bash
   npx eslint packages/react/src/components/<Component>/<Component>.figma.tsx
   pnpm --filter @deque/cauldron-react figma:publish:dry-run
   ```
   `.figma.tsx` is excluded from `tsconfig.json`, so `tsc` won't see it — the dry-run publish is the real validator. To debug what the parser sees for one file, run `pnpm figma:parse <path>` from `packages/react/`.
5. **Commit** with `chore: connect <Component> to Figma via Code Connect` (or `chore: connect Batch N components...` for multi-file work).
6. **Open a draft PR** against `develop`. If the work tracks a parent issue, include `Related to #<issue>` in the body.

## Conventions (must follow)

- **Import the component from `'../../index'`** (the barrel). Not from the component file, not from `@deque/cauldron-react`. This matches `packages/react/figma.config.json`.
- **Use bare display names**: `'Show Copy'`, not `'Show Copy#938:498'`. The trailing `#NNN:NNN` is Figma's internal property id and breaks the mapping.
- **Omit default-value mappings** so the prop renders `undefined` and is dropped from the snippet (e.g. Button's default `Variant=Primary` is not in its mapping; only `Secondary` and `Tertiary` are).
- **Keep `example` clean**: no default-valued props in the rendered JSX.
- **Ignore Figma-only props** with no React equivalent: `State`, `Device`, `Hover`, `Focus`, `Active`, `Disabled` (when purely visual), `Wrapped`.

## Mapping cheatsheet

| Figma type                               | Code Connect call                                                       | Notes                                                               |
| ---------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------- |
| VARIANT (enum, incl. `"True"/"False"`)   | `figma.enum('Name', { True: true })`                                    | `"True"/"False"` can be either type — check the icon (see gotchas). |
| BOOLEAN (real toggle)                    | `figma.boolean('Name', { true: X, false: undefined })`                  | Use `undefined` for "off" so the prop drops.                        |
| Text layer                               | `figma.textContent('Label')`                                            | Layer name, not property name.                                      |
| Nested instance prop (e.g. `_Icon Type`) | `figma.nestedProps('_Icon Type', { name: figma.string('Icon') })`       | See IconButton/Icon for the pattern.                                |
| Multiple Figma variants → one component  | Multiple `figma.connect(C, URL, { variant: { Type: 'X' }, ... })` calls | E.g. ActionMenu with Button vs Icon Button triggers.                |

## Common gotchas

- **BOOLEAN vs VARIANT — check the icon in Figma, not the value.** A property whose values look like `True`/`False` could be _either_. In the Figma properties panel: a round toggle icon = BOOLEAN, a diamond icon = VARIANT. Use `figma.boolean('Name', { true: X, false: undefined })` for the former and `figma.enum('Name', { True: X })` only for the latter (true VARIANTs with `"True"`/`"False"` string values, like Button's `Thin`). Picking wrong still renders, but reads as a workaround.
- **Empty arrow handlers fail lint.** `onClose={() => {}}` triggers `@typescript-eslint/no-empty-function`. Use `onClose={() => undefined}` instead.
- **Required React props that have no Figma source need literal stubs.** Checkbox needs `id="checkbox"` and `label="Label"`; ProgressBar needs `aria-label="Progress"`; Modal needs `show` and `onClose`.
- **Anchored components need a complete ref pattern.** Tooltip's example creates a `React.createRef` and renders both the trigger and the Tooltip so the snippet is valid usage:
  ```tsx
  example: ({ placement }) => {
    const targetRef = React.createRef<HTMLButtonElement>();
    return (
      <>
        <button ref={targetRef}>Trigger</button>
        <Tooltip target={targetRef} placement={placement}>
          Tooltip text
        </Tooltip>
      </>
    );
  };
  ```
- **Inverted booleans matter.** ExpandCollapsePanel maps `Collapsed=False` to `open=true` (the React prop is the opposite of the Figma variant). Read the React prop semantics before mapping.
- **Tooltip placement has no React default** — every Figma `Direction` value must map, even `Right`, otherwise the snippet renders without `placement` and floating-ui picks.
- **`'Combo Box'` (with space) is a known string-with-space key** if you connect to the shared `Forms` set. Quote it exactly.
- **Compound components**: verify each child name in `packages/react/src/index.ts` before importing. `Tabs` exports `Tab` + `TabPanel`; `Stepper` exports `Step`; `NavBar` exports `NavItem`; etc.

## Skip list (per #2373)

Some components have no Figma counterpart and should not be connected (utility/wrapper components, nav primitives, components covered by another). The canonical list lives in the checkboxes at [dequelabs/cauldron#2373](https://github.com/dequelabs/cauldron/issues/2373) — check there before connecting a component you don't see in `ls packages/react/src/components/*/*.figma.tsx`.

## Reference

- Convention source: `CONTRIBUTING.md` → Figma Code Connect section, and the full plan + skip list at [dequelabs/cauldron#2373](https://github.com/dequelabs/cauldron/issues/2373).
- Current set of connected components: `ls packages/react/src/components/*/*.figma.tsx`.
- Figma file key: `CEFVdiecqDjLSjhorjHUzI`. URL template: `https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id={NODE-ID-WITH-DASH}&m=dev`.
