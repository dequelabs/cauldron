# Releasing (for maintainers only)

To create a new release of this package, follow the steps below.

1. Ensure you have the latest changes
   ```
   git checkout develop
   git pull origin develop
   ```
1. Create a release branch using today's date
   ```
   git checkout -b release-YYYY-MM-DD
   git push -u origin release-YYYY-MM-DD
   ```
1. Ensure dependencies are installed, then run the release script
   ```
   yarn
   yarn release
   ```
1. Push the changes (in accordance to the `release` script's output):

   ```
   git push --follow-tags origin release-YYYY-MM-DD
   ```

   _NOTE: Do **not** `npm publish` yourself. CI will do this for you._

1. Open a Pull Request into the `master` branch by visiting `https://github.com/dequelabs/cauldron/compare/master...<release-YYYY-MM-DD>?expand=1` in your browser (replacing `YYYY-MM-DD` with the date)
