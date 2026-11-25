#!/usr/bin/env sh
# Make `git blame` skip the formatting-only commits listed in .git-blame-ignore-revs.
# The setting is local to this clone, so run it once after cloning.
set -eu

cd "$(dirname "$0")/.."

git config blame.ignoreRevsFile .git-blame-ignore-revs
echo "blame.ignoreRevsFile = $(git config --get blame.ignoreRevsFile)"
