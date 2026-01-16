# Releasing (for maintainers only)

To create a new release of `@deque/cauldron-react` and `@deque/cauldron-styles`, follow the steps below.

## Creating a New Release

- Open a new browser tab to https://github.com/dequelabs/cauldron/actions/workflows/create-release-pr.yml
- Run the `workflow_dispatch` event from the `develop` branch

This will create a release PR after the action has run successfully.

Once the release has been reviewed, merge the release branch into the `master` branch.

## Creating a new Release (Manual)

```bash
# Ensure you have the latest `develop` code.
git checkout develop
git pull origin develop
git fetch --tags
yarn run release
```

This will automagically create the release PR in a new browser window.

Once the release has been reviewed, merge the release branch into the `master` branch.

## Patch Release

If a patch release is needed with only a few cherry-picked changes, follow the steps below:

```bash
$ git checkout develop
$ git pull origin develop
$ git checkout -b <name of branch>
$ git cherry-pick <git hashes>
$ git fetch --tags
$ yarn run release
```

This will automagically create the release PR in a new browser window.

Once the patch release has been reviewed, merge the release branch into the `master` branch.

_NOTE: Do **not** `npm publish` yourself. CI will do this for you._
