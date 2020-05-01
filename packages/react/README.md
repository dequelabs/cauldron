# Cauldron React

[![CircleCI](https://circleci.com/gh/dequelabs/cauldron-react.svg?style=svg)](https://circleci.com/gh/dequelabs/cauldron-react)

## Installation

```sh
$ npm install cauldron-react --save
```

**NOTE:** it is expected that you include the css from [deque-pattern-library](https://github.com/dequelabs/pattern-library)

## Demo App

To document through example and make development / manual testing easy, there is a demo app which can be started by executing:

```sh
$ yarn dev
```

_see the `demo/` directory_

## Build

```sh
$ yarn build
```

NOTE: for production build run `$ yarn prepack`

## Test

```sh
$ yarn test
```

or to have tests automagically re-run when files change

```sh
$ yarn test --watch
```

## Publishing

Publishing `cauldron-react` to the npm registry is handled by CircleCI. All (green) commits that land in the `develop` branch will be released as a "canary" version (eg `1.2.3-canary.GIT_SHA`) and will be available with the `@next` dist tag. Additionally, all (green) `master` commits will be published as stable versions (eg `1.2.3`) and available with the `@latest` dist tag.

To install the latest canary version, do: `npm install cauldron-react@next`. To install the latest stable version, do `npm install cauldron-react`.

To publish a stable version, you'll do something like this:

```
# Ensure you have the latest code
$ git checkout develop
$ git pull
# Create a release branch
$ git create-branch release-<YYYY-MM-DD>
# Run the release script
$ npm run release
# push it
$ git push --follow-tags origin release-<YYYY-MM-DD>
```

Then open a release PR into the `master` branch.
