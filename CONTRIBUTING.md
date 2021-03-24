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

### Ensuring Screen Reader Compatability

You should test your changes with screen readers

- VoiceOver
- NVDA
- JAWS

### Ensuring Keyboard Operability

Test your component with the keyboard

### Following Accessibility Annotations

If working on a new component, you must follow the accessiblity annotations provided. This can include things like:

- accessible names (making them required via props)
- roles
- states/properties

## Local Development

Local development setup is documented in [this project's readme](./README.md#development)
