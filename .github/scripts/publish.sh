#!/usr/bin/env bash
#
# Usage: publish.sh <package-dir> <dist-tag>
#
# Packs the (already built) package once and publishes that tarball to both
# public npm and Agora. Consumer lockfiles pin the npmjs integrity hash, so
# both registries must receive the exact same bytes. A registry that already
# has the version is skipped, so re-running after a partial failure is safe.

set -euo pipefail

package_dir="$1"
dist_tag="$2"
npmjs_registry="${NPMJS_REGISTRY:-https://registry.npmjs.org/}"
agora_registry="${AGORA_REGISTRY:-https://agora.dequecloud.com/artifactory/api/npm/dequelabs/}"
: "${AGORA_TOKEN:?AGORA_TOKEN must be set}"

cd "$package_dir"
name="$(node -p "require('./package.json').name")"
version="$(node -p "require('./package.json').version")"

work_dir="$(mktemp -d "${RUNNER_TEMP:-${TMPDIR:-/tmp}}/publish.XXXXXX")"
trap 'rm -rf "$work_dir"' EXIT

tarball="$(pnpm pack --pack-destination "$work_dir" --json | jq -r .filename)"

# Keep the Agora publish token out of the job-wide npm/pnpm config: it lives
# in a throwaway userconfig passed only to the Agora commands below.
agora_npmrc="$work_dir/agora.npmrc"
printf '//%s:_authToken=%s\n' "${agora_registry#*://}" "$AGORA_TOKEN" > "$agora_npmrc"

# npm view exits 0 with no output when the package exists but the version
# doesn't, and E404 when the package doesn't exist at all. Anything else (auth,
# network) is a real failure and must not be mistaken for "not published".
is_published() {
  local out
  if out="$(npm view "$name@$version" version "$@" 2>&1)"; then
    [[ "$out" == "$version" ]]
  elif grep -q E404 <<<"$out"; then
    return 1
  else
    echo "$out" >&2
    exit 1
  fi
}

if is_published --registry "$npmjs_registry"; then
  echo "$name@$version is already on $npmjs_registry, skipping"
else
  pnpm publish "$tarball" --registry "$npmjs_registry" --tag "$dist_tag" --access public --no-git-checks
fi

if is_published --registry "$agora_registry" --userconfig "$agora_npmrc"; then
  echo "$name@$version is already on $agora_registry, skipping"
else
  npm publish "$tarball" --registry "$agora_registry" --userconfig "$agora_npmrc" --tag "$dist_tag"
fi
