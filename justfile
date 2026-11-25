set dotenv-load := false

# Generate components and build the bundle
build:
    pnpm run build

# Build the webpack bundle
build-js:
    pnpm run build:js

# Generate the components
generate:
    pnpm run build:py

# Rebuild the bundle on change
watch:
    pnpm run watch

# Install Python and Node dependencies.
install:
    uv sync
    pnpm install

# Make git blame skip the formatting-only commits (run once per clone).
setup-git-blame:
    sh scripts/setup-git-blame.sh

# Package the application for distribution using python wheel.
package: clean build
    uv run python -m build --wheel

# Format TypeScript (oxfmt) and Python (ruff).
format:
    pnpm run format
    uv run ruff format

# Check formatting and lint without writing changes.
check:
    pnpm run format:check
    pnpm run lint
    pnpm run typecheck
    uv run ruff format --check
    uv run ruff check

# Publish the package to pypi using twine.
publish: package
    uv run twine upload dist/*

# Remove dist & build directories
clean:
    rm -rf dist
    rm -rf build
    rm -rf dash_uploader_uppy5/build
