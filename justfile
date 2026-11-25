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

# Package the application for distribution using python wheel.
package: clean build
    python -m build --wheel

# Publish the package to pypi using twine.
publish: package
    twine upload dist/*

# Remove dist & build directories
clean:
    rm -rf dist
    rm -rf build
    rm -rf dash_uploader_uppy5/build
