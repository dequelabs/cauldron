# Releasing (for maintainers only)

To create a new release of this package, follow the steps below.

1. Navigate to [cauldron pull requests](https://github.com/dequelabs/cauldron/pulls?q=is%3Apr+is%3Aopen+label%3A%22autorelease%3A+pending%22) to see if there are any open PRs tagged as `autorelease: pending`.
2. Review the changelog
3. If everything looks good, merge the PR into `master`

_NOTE: Do **not** `npm publish` yourself. CI will do this for you._
