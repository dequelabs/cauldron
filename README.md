# cauldron

> The deque pattern library

This monorepo contains the following packages:

- cauldron-styles ([`packages/styles`](packages/styles/README.md))
- cauldron-react ([`packages/react`](packages/react/README.md))

It also contains the documentation / demo app (see `docs/`)

## contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md)

## development

### install dependencies

```sh
$ yarn
```

### build (if first time building dev environment, must be run before yarn dev)

```sh
$ yarn build
```

### dev

(watches/rebuilds react, styles, and docs)

```sh
$ yarn dev
```

navigate browser to http://localhost:8000

### run tests

(runs all tests)

```sh
$ yarn test
```
