# Contributing

## Code Quality

The files in this project are formatted by Prettier and ESLint. Both are run when code is committed (as a pre-commit hook). Additionally, you can run ESLint manually:

```sh
$ yarn lint
```

## Commit Messages

We follow the [conventional commit specification](https://www.conventionalcommits.org/en/v1.0.0/#summary), please ensure your commit message or pull request title follows the spec.

## Unit Testing

It is expected that you fully cover the code changes in your patch with unit tests. The tests can be run manually:

```sh
$ yarn test
```

## Accessibility Testing

### Ensuring component returns no violations (in unit test)

We use [jest-axe](https://www.npmjs.com/package/jest-axe) to run axe in our unit tests. It is expected that you run axe in **all states** of your component.

```js
test('should return no axe violations', async () => {
  const wrapper = shallow(<MyCauldronComponent />);
  expect(await axe(wrapper.html())).toHaveNoViolations();
});
```

### Ensuring Screen Reader Compatibility

You should test your changes with screen readers

- VoiceOver
- NVDA
- JAWS

### Ensuring Keyboard Operability

Test your component with the keyboard

### Following Accessibility Annotations

If working on a new component, you must follow the accessibility annotations provided. This can include things like:

- accessible names (making them required via props)
- roles
- states/properties

## Local Development

Local development setup is documented in [this project's readme](./README.md#development)

## React

Cauldron is an evolving project. Moving forward, it is preferred that the react components are implemented with simplicity and readability in mind.

- functional components over class components
  - hooks over `setState`
- `React.forwardRef` over `ref={el => ...}`
- declaring valid typescript types for components
- including `PropTypes` for non-typescript consumers of this project

## Styles

We use [BEM](http://getbem.com/introduction/) for our CSS naming conventions. Here's an example for a mythical "Calendar" component:

We always start with the component name, uppercased:

```css
.Calendar {
  border: 1px solid var(--gray-90);
}
```

For blocks within the component, such as a date within a calendar would be delimited by two underscores: `__`

```css
.Calendar__date {
  border: 1px solid var(--gray-90);
}
```

For modifiers, such as variants or states, these values would be delimited by two dashes `--`

```css
.Calendar--variant-large {
  font-size: var(--text-size-large);
}

.Calendar--variant-small {
  font-size: var(--text-size-small);
}
```

## Icons

Icons are located in [packages/react/src/components/Icon/icons](./packages/react/src/components/Icon/icons). To add a new icon, follow the following steps:

- Change any `fill`, `stroke`, or any color related attributes in the SVG to use `currentColor`.
- Remove any namespace attributes (such as `xmlns:*`) from the SVG.
- Save your icon in the above location with the proposed name of your icon, e.g. `[your-name].svg`. The `your-name` portion will be how the icon is used in the React Component, e.g. `<Icon type="your-name" />`.
- Submit a new `feat` PR with your changes.

## Breaking Changes

Cauldron is constantly evolving, and it's inevitable that breaking changes will need to be introduced. Before a breaking change is released, other alternatives should be considered and allow for a deprecation period before the breaking change is released.

### Components

For cauldron's component library, any of the following would be considered breaking changes:

* Renaming (exported name) or removing a Component
* Changing a prop that would break usage of an existing component
* Adding a new required prop to an existing component

### Styles

For cauldron's styles library, any of the following would be considered breaking changes:

* Changing or removing a class name
* Changing or removing a global variable (see `variables.css`)
* Changing or removing a component variable

In addition, changing a css property may be a breaking change for the following:

* Changing a global variable property (see `variables.css`)
* Changing a component variable property

For the latter, the change must be reviewed by a member of the cauldron team to ensure there are no breaking changes.

### Deprecating

Before a breaking change can be released, the breaking change should be documented with the component, property, or style being changed getting flagged as _Deprecated_. This could mean warning the consumer that a component or property is now deprecated, or including a deprecated comment next to a css class name. This deprecation must exist for at least two months.

### Removal

Once the deprecation period has passed, the breaking change can be implemented by removing the deprecation and including `BREAKING CHANGE:` in the body of your commit message with the description of the breaking change.
