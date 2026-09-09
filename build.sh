#!/usr/bin/env bash
set -Eeuo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
cd "$project_dir"

if [[ ! -f package.json ]]; then
  echo "Error: package.json was not found in $project_dir" >&2
  exit 1
fi
command -v node >/dev/null 2>&1 || { echo "Error: Node.js is required." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "Error: npm is required." >&2; exit 1; }

# Android/Termux can fail when npm installs executable shims on shared storage.
# Build in Termux private storage there; everywhere else build in-place.
if [[ "${PREFIX:-}" == /data/data/com.termux/files/usr* ]]; then
  for cmd in rsync sha256sum; do
    command -v "$cmd" >/dev/null 2>&1 || {
      echo "Error: $cmd is required in Termux. Run: pkg install rsync coreutils" >&2
      exit 1
    }
  done
  project_id="$(printf '%s' "$project_dir" | sha256sum | cut -c1-12)"
  build_dir="$PREFIX/var/tmp/zerra-build-$project_id"
  npm_cache_dir="$PREFIX/var/cache/zerra-npm"
  mkdir -p "$build_dir" "$npm_cache_dir"
  rsync -a --delete --exclude='.git/' --exclude='node_modules/' "$project_dir/" "$build_dir/"
  cd "$build_dir"
  npm_config_cache="$npm_cache_dir" npm ci --no-audit --no-fund
  npm_config_cache="$npm_cache_dir" npm run build
  mkdir -p "$project_dir/dist"
  rsync -a "$build_dir/dist/" "$project_dir/dist/"
else
  # npm ci makes the build deterministic from package-lock.json and also repairs
  # incomplete/mismatched dependency trees from previous installs.
  npm ci --no-audit --no-fund
  npm run build
fi

echo "Build complete: $project_dir/dist"
