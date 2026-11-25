# Make `git blame` skip the formatting-only commits listed in .git-blame-ignore-revs.
# The setting is local to this clone, so run it once after cloning.
$ErrorActionPreference = "Stop"

Set-Location (Join-Path $PSScriptRoot "..")

git config blame.ignoreRevsFile .git-blame-ignore-revs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Output "blame.ignoreRevsFile = $(git config --get blame.ignoreRevsFile)"
