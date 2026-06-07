# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Add `hide_drag_over_hint` (experimental) option to hide the drag-over upward arrow hint animation (the blue dashed box
  with ↑ icon).
  Implemented via `useEffect` that dynamically injects/removes a `<style>` targeting
  `.uppy-Dashboard-dropFilesHereHint`.
  Exposed in both Python `Upload()` and React `DashUploaderUppy5`. Marked EXPERIMENTAL in docs/comments as it is not an
  official Uppy feature and may break on future Uppy updates. (5ffcebb)
- Add `auto_clear_on_complete` option to automatically clear files after a successful upload completes (5ffcebb)
- Add `disable_status_bar` option to completely disable the status bar (490026c)
- Add `retryTrigger` / `retryOperation` and `cancelTrigger` / `cancelOperation` (Dash input/response) for custom
  retry/cancel buttons (ef257dd)
  - Add `useHandleRetryTrigger` hook (uses `uppy.retryAll()`) and `useHandleCancelTrigger` hook (uses
    `uppy.cancelAll()`)
  - Add `hide_retry_button` and `hide_cancel_button` parameters in `Upload()` to hide Dashboard's built-in retry/cancel
    buttons when supplying custom controls (pairs with the new triggers)
  - Refactor: move all Trigger/Operation fields (`*Trigger`, `*Operation`) from `UppyCallbacks` interface to a dedicated
    `Triggers` interface for clearer separation of passive callbacks vs. active control triggers
- Add `uploadTrigger` (Dash input) and `uploadOperation` (component response) for manual upload triggering via
  `uppy.upload()` when `auto_proceed=False` (59eb2e4)
  - Add `useHandleUploadTrigger` hook with defense: ignores trigger and returns error when `autoProceed=True`
  - Also returns error when no files are queued
  - Add `OperationResult` TypeScript interface (renamed from `ClearOperation`); includes `attempt` field so each trigger
    yields a distinct result and Dash callbacks always fire
  - Expose `hide_upload_button` parameter in `Upload()` to hide the built-in upload button when supplying a custom one
    (pairs with `uploadTrigger`)
- Add `locale_string` option to override partial Dashboard locale strings (drop/paste hints and browse labels) (da1f7bd)
  - Add `LocaleStringConfig` Pydantic model; export from package `__init__.py`
  - Add `buildLocaleString` utility to merge only provided keys without overwriting Uppy defaults with `undefined`
- Add `disable_done_button` option to hide the Dashboard "Done" button after upload completes (12060ee)
- Split clear API into `clearTrigger` (Dash input) and `clearOperation` (component response) for programmatic file
  clearing (8be2443)
  - Add `useHandleClearTrigger` hook and `ClearOperation` TypeScript interface
- Add Pydantic models (`UploadConfig`, `SizeConfig`) for type validation and conversion of `Upload()` parameters (
  a386256)
  - Export `UploadConfig` and `SizeConfig` from package `__init__.py`
  - Add `pydantic>=2.13.4` as a runtime dependency
- Extract Uppy event handlers into `useSetupUppyEventHandlers` custom hook (c6a102c)
- Add `CHANGELOG.md` (00e8ad2)

### Changed

- Refactor: extract repeated `setProps` callback pattern into a curried `setOperationResult` helper in
  `DashUploaderUppy5.tsx` (a47d2f8)
- Refactor `Upload()` to use sentinel (`_UNSET`) pattern so Pydantic `default`/`default_factory` become the single
  source of truth; function signature is dynamically generated from `UploadConfig.model_fields` to preserve IDE/help()
  experience (c547965)
- Default Dashboard `size` to `{"width": "100%", "height": "100%"}` instead of Uppy's built-in 650×500px, so the
  uploader fits its parent container when `size` is omitted; allow `size.width` and `size.height` to accept CSS length
  strings (e.g. `"100%"`, `"75px"`, `"50vw"`, `"10rem"`) in addition to pixel integers (68ff925)
- Refactor `Upload()` to build component props via `UploadConfig.model_dump()` (a386256)
- Upgrade Node.js to 22.22.0 in `.nvmrc` (bee52a4)
- Upgrade dash dependency to `>=3.4.0`, constrain dev dependency to `<4.0.0` (2c4dcfc, ef535dd)
- Update project dependencies and lock file (a0501dc)
  - setuptools, cookiecutter, wheel, build, and related dev tools
- Revert component generator command to `dash-generate-components` (ff47cf4)
- Make `Upload()` parameters keyword-only (after `id`) (97affed)
- Refine `upload_id` documentation and examples in README and `Upload()` docstring (cef5bf4)
- Rename `ClearOperation` → `OperationResult` for reuse across `clearOperation` and `uploadOperation`

### Fixed

- Prevent duplicate/accidental uploads when `auto_proceed=True` is combined with `uploadTrigger`:
  - Python `RuntimeWarning` emitted at `Upload()` construction time
  - Runtime rejection in hook (returns `{status:"error", attempt:N}`) (d4c0714)
- Correct field name in `max_number_of_files` validator (`min_file_size` → `min_number_of_files`) (ed7ebbf)
- Handle `None` filename in `UploadHandler.get_secure_filename` (2f38c6b)

### Documentation

- Document the experimental `hide_drag_over_hint` prop in the API Parameters table of README.md. (5ffcebb)
- Add changelog link section to README (0826ae1)
- Document `disable_done_button`, `clearTrigger`, and `clearOperation` in README

## [0.2.1] - 2026-05-04

### Fixed

- Expose `upload_id` in the `uploadedFiles` callback to resolve #1 (999d127)
    - Update TypeScript type definitions
    - Improve README examples and documentation
    - Update `package.json`, `pyproject.toml` and `usage.py`

### Documentation

- Update README.md (16f0e60)

## [0.2.0] - 2025-12-19

### Added

- Add `isUploading` callback for real-time upload progress tracking (094e612)
    - Implement upload start/completion state management
    - Add upload event listeners
- Extract `createStringUnionGuard` utility for reusable string union type validation (094e612, 958ef90)
- Add comprehensive Upload API parameters and upload event callbacks (ff60644)
    - Support full Dashboard configuration options (`theme`, `note`, `size`, `hide_progress_details`, etc.)
    - Implement structured upload completion handling with result callbacks
    - Improve type safety with detailed callback interfaces

### Changed

- Refactor validation logic and improve code organization (958ef90, 094e612)
- Enhance README documentation, formatting, and examples
- Update Shields badges and complete documentation (627d6f8, 5d25483)
- Refactor Dash component Props interface and Dashboard configuration (e39bf98)

### Documentation

- Complete documentation and release preparation (5d25483)
    - Add detailed installation, usage, and API reference
    - Include working callback examples

## [0.1.1] - 2025-12-14

### Changed

- Refactor validation logic and improve code organization (958ef90)
    - Extract inline validation functions into reusable type guard utilities
    - Enhance README documentation formatting and type information
    - Optimize code structure for better maintainability

## [0.1.0] - 2025-12-12

### Added

- Deliver complete MVP with full backend architecture (5db2df2)
    - Implement `configurator`, `settings`, and `uploadhandler`
    - Provide high-level `Upload()` API for simple one-line integration
    - Support actual file uploads with secure streaming and `upload_id` folder management
    - Add enterprise-grade error handling and logging
- Refactor to official Uppy 5 Dashboard component (e39bf98)
    - Remove TailwindCSS dependency in favor of official Uppy styles
    - Simplify component architecture
    - Add comprehensive Dashboard configuration options
- Implement complete Uppy 5 React UI components (937f040)
    - Include Dropzone, UploadButton, FilesList and related components
    - Redesign Props interface based on Uppy 5
    - Restructure into dedicated `types/` and `utils/` directories
    - Extract Uppy instance creation to `createUppy` utility

### Changed

- Major architecture refactor from prototype to production-ready package (5db2df2)
- Update build configuration, dependencies, and remove obsolete files

---

This changelog was generated from git history and existing tags (`v0.1.0`, `v0.1.1`, `v0.2.0`, `v0.2.1`).