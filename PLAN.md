# Add Snapshot Tests for SkipLink Caret Alignment Fix

This branch already shipped a CSS fix (`42090934`) for the SkipLink caret alignment bug, but the work missed the snapshot test coverage required by [`e2e/readme.md`](./e2e/readme.md). This plan adds the missing screenshot tests so the regression we just fixed is locked in.

Issue: [#2276 – Bug: Skip Link Carrot is misaligned](https://github.com/dequelabs/cauldron/issues/2276)
Pull Request: TBD (existing branch PR — the snapshot tests should be added to it)

## Context

- The fix narrowed `.SkipLink span` (which incorrectly applied `display: block` to the inner span wrapping `<Icon>`) to `.SkipLink__item--first, .SkipLink__item--second`.
- `packages/react/src/components/SkipLink/` has no `screenshots.e2e.tsx`; existing patterns live in sibling components (e.g. `Link`, `Button`, `SearchField`, `BottomSheet`, `Modal`).
- The SkipLink panel is hidden by default (`top: -999px; opacity: 0`) and is only visible after focus, when JS adds `SkipLink--active SkipLink--fade` (with a `setTimeout` between the two class additions and a 250ms opacity transition).
- The `target` prop is queried with `document.querySelector(...)` on click; it does not need a real element on the page for focus-only screenshots, but the prop is required.
- Snapshot files are written to `e2e/screenshots/` as `<name>.png` / `dark--<name>.png` and must be generated inside the project's Docker image so they match CI.

## Steps

- [x] Create `packages/react/src/components/SkipLink/screenshots.e2e.tsx`, importing `test`/`expect` from `../../../../../e2e/screenshots` and `setTheme` from `../../../../../e2e/helpers/playwright`.
- [x] Add a default-props test (`Skip to` / `Main Content`):
  - Mount `<SkipLink target="#main-content" />`.
  - Focus the link via `component.getByRole('link').focus()`.
  - Wait for the fade animation to complete (`SkipLink--fade` class present, or a fixed wait equivalent to the 250ms opacity transition) so the caret + targetText line is fully rendered.
  - Capture against the `nav` element (use `page.getByRole('navigation')` or `component`) — the absolute positioning means we want the panel itself, not the empty mount root.
  - `await expect(...).toHaveScreenshot('skiplink')` then `await setTheme(page, 'dark')` and `'dark--skiplink'`.
- [x] Add a custom-text test that exercises a longer `targetText` (e.g. `targetText="Main page content"`) so the caret-vs-text alignment regression is visible if the CSS regresses. Snapshot names: `skiplink-custom-text` and `dark--skiplink-custom-text`.
- [ ] (Optional, only if the fade timing makes the default test flaky) Disable the fade transition for the screenshot via inline style or a `page.addStyleTag` call rather than introducing arbitrary `waitForTimeout`s. _Skipped — waiting on `SkipLink--fade` class plus Playwright's built-in `animations: 'disabled'` should fast-forward the opacity transition. Revisit only if flakiness shows up._
- [x] Build the screenshots Docker image if not already built: `yarn screenshots:docker`. _Built via `docker build` after pulling `mcr.microsoft.com/playwright:v1.50.1-jammy` manually — the initial `yarn screenshots:docker` hung on the base-image pull at zero CPU._
- [x] Generate baselines: `yarn screenshots --update-snapshots`. Verify the produced PNGs in `e2e/screenshots/` show the caret inline with `Main Content`/`Main page content` (no stacked caret above the text).
- [x] Run `yarn screenshots` to confirm the new tests pass against the generated baselines.
- [ ] Sanity check: temporarily revert the CSS fix locally, re-run `yarn screenshots`, confirm the new tests fail (caret stacks). Restore the fix afterwards. This proves the snapshots actually guard the regression.
- [ ] Commit the new test file and the generated PNGs (`packages/react/src/components/SkipLink/screenshots.e2e.tsx` and any new files under `e2e/screenshots/`) with a `test(skip-link): ...` message.
- [x] Update `rheisler/fix-skip-link-caret-alignment/pr-notes.md` with anything reviewers should know (notably: the snapshot baselines were generated via Docker, and the fade-handling approach we picked). _Initial pass written; revisit if the baseline-generation step turns up anything new._

## Out of Scope

- Refactoring `SkipLink` (the `index.tsx` JSX, the legacy `<ul>`-based CSS rules, the class-component vs hooks question) — this branch is a pure bug fix plus its missing test.
- Updating unrelated component snapshots.
