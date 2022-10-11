# Cauldron RFCs

## What is an RFC?

A request for comments, or further referred to as "RFC" is a process intended to provide a consistent and controlled path for changes to be introduced to Cauldron.

Many changes, including bug fixes and documentation improvements can be implemented and reviewed via the normal GitHub pull request workflow. Some changes though are "substantial", and we ask that these be put through a bit of a design process and provide a consensus among the Cauldron team.

## When to follow this process

You should follow this process if you intend to make substantial changes to Cauldron or its documentation. Some examples that would benefit from an RFC include:

- A new component or feature
- Any breaking changes

Some changes that would not need an RFC:

- Bug fixes
- Refactoring an existing component (while maintaining the same API contract)
- Rephrasing or clarifying documentation

## How to submit an RFC

1. Create a new issue
1. Add the `rfc` label
1. Be sure to include descriptive details, this includes:
   - A descriptive title
   - Implementation details
   - Screenshots (if necessary for a new component)

## The RFC Process

The goal of our RFC process is to reach a consensus among the cauldron team on proposed changes, and to ensure that new features are congruent with the rest of Cauldron. The Cauldron team will have a recurring office hours meeting on the 1st Wednesday of each month, giving the team the opportunity to discuss any new RFCs that have been introduced and make comments.

Once a consensus has been reached for the proposed RFC, the `rfc` label will be removed from the issue and the proposed changes can then be implemented.

## What is a Breaking Change?

Cauldron provides a public API that consists of two parts, React components and CSS styles, each of which has its own package. In principle, any change to these two parts of API that is backward incompatible should be marked as a breaking change, and we should increment the major version number whenever a breaking change takes place (see [Semantic Versioning Specification (SemVer)](https://semver.org/)).

However there is a debate on whether to mark certain changes to Cauldron CSS styles (such as removing or renaming a classname) as breaking, or whether to increment the major version number assuming that those CSS styles changes are breaking. There are a few reasons behind the hesitance to mark these changes as breaking and bump the major version:

1. we might break our API too frequently and that would decrease Cauldron's stability and risk fatiguing our users

2. we assume that the majority of Cauldron users do not consume CSS styles separately from their React components (although we allow our users to do so)

3. we have not been marking the changes to remove or rename a classname as breaking

The counterpoint to the first concern is that major version numbers are not sacred, as the creator of `SemVer` spec [defends releasing a new major version only about one month after the previous one](https://tom.preston-werner.com/2022/05/23/major-version-numbers-are-not-sacred.html). The proponents of `SemVer` spec also point out that we do not have any data to show how exactly our users utilize Cauldron. Therefore the first assumption could be right, but we have no proof for it and we have no control over how our users consume Cauldron. The last point is dictated by how we agree on the first two.

One key to the debate is whether we would want to (or continue to) support the consumption of Cauldron CSS styles separately from Cauldron React components, although that was the original intention for Cauldron. The following definitions and examples of breaking and non-breaking changes are based on the original intention. At the same time, the notes explore different scenarios if we decide against the original intention.

### Cauldron React components: breaking changes

1. Remove, replace, rename a component, as well as modify the relations between components

   - renamed Panel to IssuePanel
   - TabPanels are no longer TabList's children

2. Add, remove, replace, or rename required properties of a React component

   - removes the light/dark variant options for IconButton and TopBar.
   - The panel implementation has been replaced, including removing props that are not used in the new implementation
   - Loader component now set role, aria-valuetext, aria-busy, aria-valuemin, and aria-valuemax instead of making a generic role (div) have an aria-label

3. Modify the elements of which a React component consists, such as HTML tags and properties
   - selects now have parity with `<TextField />`s in that they always render an .Error div. This causes a slight layout difference with more space below each `<Select />`. The text "Required" will now show up with any `<Select />` who is passed a true required prop
   - topbar no longer renders role=menubar. New component `<MenuBar />` must now be used if menubar is desired
   - The api for for implementing a tooltip has changed. Instead of `<Tooltip><button /><Tooltip>`, the tooltip takes a target ref or html element. (This is a combination of breaking change #2 and #3)

### Cauldron CSS styles: breaking changes

1. Remove or rename a CSS classname

2. Change the value of a CSS classname that results in visual difference (see examples in [Visual Breaking Change in Design Systems](https://medium.com/eightshapes-llc/visual-breaking-change-in-design-systems-1e9109fac9c4))

   **Note**: if we decide not to support the consumption of CSS styles separately from the React components, then we should at least mark the shared classnames as breaking (`packages/styles/variables`)

### What is not a Breaking Change?

1. Add a React component or CSS classname

2. Add optional properties to a React component

3. Change the value of a CSS classname that does not result in visual difference

4. Change the areas that are not a part of Cauldron's public API, such as docs, demos, and tests
