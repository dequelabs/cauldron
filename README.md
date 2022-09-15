# cauldron

> The deque pattern library

This monorepo contains the following packages:

- cauldron-styles ([`packages/styles`](packages/styles/README.md))
- cauldron-react ([`packages/react`](packages/react/README.md))

It also contains the documentation / demo app (see `docs/`)

## purpose

Friends don’t let friends ship inaccessible code! These accessible packages include everything from typography and colors, to components like custom form controls. The design and interactions shown throughout this site are intended to show how Deque provides accessible experiences for the users of our own products - through the use of common, accessible components like these.

## usage

[Cauldron React](packages/react/README.md) is an accessible React components library. [Cauldron Styles](packages/styles/README.md) contains accessible styling for those components and more.

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
