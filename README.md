# cauldron

> The deque pattern library

This monorepo contains the following packages:

- cauldron-styles ([`packages/styles`](packages/style/README.md))
- cauldron-react ([`packages/react`](packages/react/README.md))

It also contains the documentation / demo app (see `docs/`)

## development

### install dependencies

```sh
$ yarn
```

### dev

(watches/rebuilds react, styles, and docs)

```sh
$ yarn dev
```

navigate browser to http://localhost:8000

### build

```sh
$ yarn build
```

### run tests

(runs all tests)

```sh
$ yarn test
```

## adding a new component

```sh
$ ./add-component foo
# - creates new `packages/styles/foo.css` file
# - adds "@import ./foo.css" to the end of packages/styles.index.css
# - creates new `packages/react/src/Foo/index.ts` file
```
