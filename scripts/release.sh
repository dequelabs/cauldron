#!/bin/bash

set -e

throw() {
  echo "$@" 1>&2
  exit 1
}

branch_name="release-staging"
version=$(node -p 'require("./package.json").version')
changelog=CHANGELOG.md
tag_prefix=
message="chore(cauldron): Release {{currentTag}}"

echo "Creating release staging branch: $branch_name"
git checkout -b "$branch_name"

# Run release stuff (update package.json#version, changelog, etc.)
npx standard-version \
  --releaseCommitMessageFormat="$message" \
  --infile="$changelog" \
  --commit-all \
  --skip.tag true \
  "${@:1}" # allow runtime args to be passed into standard-version

# Get the new version number
new_version=$(node -p 'require("./package.json").version')

# Set the remote branch with the release version
release_branch="release-v$new_version"

git branch -M $release_branch

if git ls-remote --exit-code origin "$release_branch" > /dev/null 2>&1; then
  echo "Remote branch $release_branch already exists. Aborting."
  exit 1
fi

git push origin $release_branch

# Get the additions to the changelog as the commit body and generate the PR url
uri_encoded_commit_body=$(git show --no-color --no-prefix --output-indicator-new=! CHANGELOG.md | egrep '^!' | awk -F'^[!]' '{print $2}' | sed -e 's/\n/$0A/g' | node -p 'encodeURIComponent(require("fs").readFileSync(0))')
uri_encoded_message=$(git show --no-patch --format=%s | node -p 'encodeURIComponent(require("fs").readFileSync(0))')
pr_url="https://github.com/dequelabs/cauldron/compare/master...$release_branch?title=$uri_encoded_message&body=$uri_encoded_commit_body"

echo "\nOpening $pr_url in your browser."
open -n $pr_url