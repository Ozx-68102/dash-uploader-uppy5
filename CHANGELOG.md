# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Align `uploadStatus` and `retryStatus` with other `*Status` props: receipt for whether the trigger was accepted and
  the corresponding Uppy API was invoked, not the async upload/retry outcome (reported via `uploadedFiles` /
  `failedFiles`) (9d16437a)

### Fixed

- Fix PyPI package metadata: use `Homepage` (not `Homepages`) in `[project.urls]` so Home Page displays on PyPI and
  pypistats; use name-only `authors` entries so Author displays correctly (d83fa6db)

### Documentation

- Expand README Trigger Properties docs for Dash callback integration: split from Callback Variables; document
  `*Trigger`/`*Status` Output/Input pairing, shared status receipt structure, `du.Upload()` setup per trigger, error
  conditions, and callback examples (`prevent_initial_call`, `allow_duplicate`) (9b9d1333)
- Rephrase trigger-related API parameter and `failedFiles` wording for Dash users (remove internal API names) (9b9d1333)

## [0.3.0] - 2026-06-08

### Added

- Add `hide_drag_over_hint` (experimental) option to hide the drag-over upward arrow hint animation (the blue dashed box
  with ↑ icon).
  Implemented via `useEffect` that dynamically injects/removes a `<style>` targeting
  `.uppy-Dashboard-dropFilesHereHint`.
  Exposed in both Python `Upload()` and React `DashUploaderUppy5`. Marked EXPERIMENTAL in docs/comments as it is not an
  official Uppy feature and may break on future Uppy updates. (5ffcebb3)
- Add `auto_clear_on_complete` option to automatically clear files when an upload batch completes (Uppy `complete`
  event) (5ffcebb3)
- Add `disable_status_bar` option to completely disable the status bar (490026c0)
- Add `retryTrigger` / `retryOperation` and `cancelTrigger` / `cancelOperation` (Dash input/response) for custom
  retry/cancel buttons (ef257dd6)
  - Add `useHandleRetryTrigger` hook (uses `uppy.retryAll()`) and `useHandleCancelTrigger` hook (uses
    `uppy.cancelAll()`)
  - Add `hide_retry_button` and `hide_cancel_button` parameters in `Upload()` to hide Dashboard's built-in retry/cancel
    buttons when supplying custom controls (pairs with the new triggers)
  - Refactor: move all Trigger/Operation fields (`*Trigger`, `*Operation`) from `UppyCallbacks` interface to a dedicated
    `Triggers` interface for clearer separation of passive callbacks vs. active control triggers
- Add `uploadTrigger` (Dash input) and `uploadOperation` (component response) for manual upload triggering via
  `uppy.upload()` when `auto_proceed=False` (59eb2e4c)
  - Add `useHandleUploadTrigger` hook with defense: ignores trigger and returns error when `auto_proceed=True`
  - Also returns error when no files are queued
  - Add `OperationResult` TypeScript interface (renamed from `ClearOperation`); includes `attempt` field so each trigger
    yields a distinct result and Dash callbacks always fire
  - Expose `hide_upload_button` parameter in `Upload()` to hide the built-in upload button when supplying a custom one
    (pairs with `uploadTrigger`)
- Add `locale_string` option to override partial Dashboard locale strings (drop/paste hints and browse labels) (
  da1f7bd0)
  - Add `LocaleStringConfig` Pydantic model; export from package `__init__.py`
  - Add `buildLocaleString` utility to merge only provided keys without overwriting Uppy defaults with `undefined`
- Add `disable_done_button` option to hide the Dashboard "Done" button after upload completes (12060ee9)
- Split clear API into `clearTrigger` (Dash input) and `clearOperation` (component response) for programmatic file
  clearing (8be2443c)
  - Add `useHandleClearTrigger` hook and `ClearOperation` TypeScript interface
- Add Pydantic models (`UploadConfig`, `SizeConfig`) for type validation and conversion of `Upload()` parameters (
  a3862564)
  - Export `UploadConfig` and `SizeConfig` from package `__init__.py`
  - Add `pydantic>=2.13.4` as a runtime dependency
- Extract Uppy event handlers into `useSetupUppyEventHandlers` custom hook (c6a102ca)
- Add `CHANGELOG.md` (00e8ad20)

### Changed

- Clarify `uploadStatus` reflects `uppy.upload()` promise outcome; other `*Status` props remain trigger receipts
  (2b11380d)
- Restore Dashboard pause/resume controls (`hidePauseResumeButton={false}`) (d0f5b204)
- Clarify `auto_clear_on_complete`: clears files on the Uppy `complete` event; `uploadedFiles` / `failedFiles`
  are reported to Dash before the UI resets (65dc1115)
- Rename `OperationResult` interface to `TriggerStatus`; document receipt semantics for `clearStatus`,
  `cancelStatus`, and `retryStatus` (01809bf8)
- Rename Dash props: `clearOperation` → `clearStatus`, `uploadOperation` → `uploadStatus`,
  `retryOperation` → `retryStatus`, `cancelOperation` → `cancelStatus` (01809bf8)
- Rename internal hook parameters and refs from `on*Result` / `on*ResultRef` to `on*Status` / `on*StatusRef`
  for naming consistency (01809bf8)
- Update README.md Callback Variables section and `usage.py` examples to reflect the new field names (01809bf8)
- Refactor: extract repeated `setProps` callback pattern into a curried `setOperationResult` helper in
  `DashUploaderUppy5.tsx` (a47d2f86)
- Refactor `Upload()` to use sentinel (`_UNSET`) pattern so Pydantic `default`/`default_factory` become the single
  source of truth; function signature is dynamically generated from `UploadConfig.model_fields` to preserve IDE/help()
  experience (c5479658)
- Default Dashboard `size` to `{"width": "100%", "height": "100%"}` instead of Uppy's built-in 650×500px, so the
  uploader fits its parent container when `size` is omitted; allow `size.width` and `size.height` to accept CSS length
  strings (e.g. `"100%"`, `"75px"`, `"50vw"`, `"10rem"`) in addition to pixel integers (68ff9251)
- Refactor `Upload()` to build component props via `UploadConfig.model_dump()` (a3862564)
- Upgrade Node.js to 22.22.0 in `.nvmrc` (bee52a4d)
- Upgrade dash dependency to `>=3.4.0`, constrain dev dependency to `<4.0.0` (2c4dcfcb, ef535dd9)
- Update project dependencies and lock file (a0501dcf)
  - setuptools, cookiecutter, wheel, build, and related dev tools
- Revert component generator command to `dash-generate-components` (ff47cf4b)
- Make `Upload()` parameters keyword-only (after `id`) (97affedb)
- Refine `upload_id` documentation and examples in README and `Upload()` docstring (cef5bf49)
- Rename `ClearOperation` → `OperationResult` for reuse across `clearOperation` and `uploadOperation`

### Fixed

- Emit `uploadStatus` after `uppy.upload()` settles (`success` on resolve, `error` on reject); per-file outcomes
  remain on `uploadedFiles` / `failedFiles` (ab76a8fa)
- Prevent trigger hooks from re-firing on Dash re-render when `*Trigger` is unchanged (skip `0`, track last handled
  value, compare `*Status.attempt`) (d0f5b204)
- Add missing Pydantic models to `__all__`; handle missing form `uploadId` in upload handler (d0f5b204)
- Align trigger conflict handling to runtime-only rejection (85c135b4, 1bf0cf61, 59eb2e4c, d4c07145)
  - Remove construction-time `RuntimeWarning` for `auto_proceed` + `uploadTrigger` and `auto_clear_on_complete` +
    `retryTrigger`
  - Reject `uploadTrigger` when `auto_proceed=True` or no files are queued; reject `retryTrigger` when
    `auto_clear_on_complete=True` (returns `{status:"error"}` via `*Status`)
  - Use Python-facing names (`auto_proceed`, `auto_clear_on_complete`) in trigger error messages
- Fix `hide_drag_over_hint` when multiple uploaders share the same page (ec72b95f)
  - Previously injected one global `<style>`; unmounting or disabling one instance removed the rule for all others
  - Extract style management to `hideDragOverHintStyle.ts`; scope CSS per component `id`
    (`#<id> .uppy-Dashboard-dropFilesHereHint`) so each uploader owns its style tag and mixed hide/show setups work
    independently
- Fix `max_number_of_files` / `min_number_of_files` cross-field validation in `UploadConfig` (f010fce3)
  - Invalid pairs such as `max_number_of_files=1` with `min_number_of_files=5` could pass because the `@field_validator`
    on `max` ran before `min` was validated (Pydantic field order)
  - Move the `max >= min` check to `@model_validator(mode="after")` so both fields, including defaults, are resolved
    first
- Correct field name in `max_number_of_files` validator (`min_file_size` → `min_number_of_files`) (ed7ebbff)
- Handle `None` filename in `UploadHandler.get_secure_filename` (2f38c6b1)

### Documentation

- Document `uploadStatus` batch-level promise semantics in README and TypeScript prop docs (2b11380d)
- State that `auto_clear_on_complete` and retry (`retryTrigger` / Dashboard retry) cannot be used together
  (1bf0cf61)
- Clarify `auto_clear_on_complete` semantics and incompatibility with Dashboard retry / `retryTrigger` in
  README, `Upload()` docstring, and TypeScript prop docs (65dc1115, 1bf0cf61)
- Document the experimental `hide_drag_over_hint` prop in the API Parameters table of README.md. (5ffcebb3)
- Add changelog link section to README (0826ae10)
- Document `disable_done_button`, `clearTrigger`, and `clearStatus` in README
- Cross-reference `auto_proceed` / `uploadTrigger` and `auto_clear_on_complete` / `retryTrigger` in README,
  `Upload()` docstring, and TypeScript prop docs; clarify `hide_*_button` as UI pairing (not a trigger prerequisite)
  (85c135b4)

## [0.2.1] - 2026-05-04

### Fixed

- Expose `upload_id` in the `uploadedFiles` callback to resolve #1 (999d127c)
    - Update TypeScript type definitions
    - Improve README examples and documentation
    - Update `package.json`, `pyproject.toml` and `usage.py`

### Documentation

- Update README.md (16f0e602)

## [0.2.0] - 2025-12-19

### Added

- Add `isUploading` callback for real-time upload progress tracking (094e6121)
    - Implement upload start/completion state management
    - Add upload event listeners
- Extract `createStringUnionGuard` utility for reusable string union type validation (094e6121, 958ef907)
- Add comprehensive Upload API parameters and upload event callbacks (ff606440)
    - Support full Dashboard configuration options (`theme`, `note`, `size`, `hide_progress_details`, etc.)
    - Implement structured upload completion handling with result callbacks
    - Improve type safety with detailed callback interfaces

### Changed

- Refactor validation logic and improve code organization (958ef907, 094e6121)
- Enhance README documentation, formatting, and examples
- Update Shields badges and complete documentation (627d6f81, 5d254830)
- Refactor Dash component Props interface and Dashboard configuration (e39bf987)

### Documentation

- Complete documentation and release preparation (5d254830)
    - Add detailed installation, usage, and API reference
    - Include working callback examples

## [0.1.1] - 2025-12-14

### Changed

- Refactor validation logic and improve code organization (958ef907)
    - Extract inline validation functions into reusable type guard utilities
    - Enhance README documentation formatting and type information
    - Optimize code structure for better maintainability

## [0.1.0] - 2025-12-12

### Added

- Deliver complete MVP with full backend architecture (5db2df21)
    - Implement `configurator`, `settings`, and `uploadhandler`
    - Provide high-level `Upload()` API for simple one-line integration
    - Support actual file uploads with secure streaming and `upload_id` folder management
    - Add enterprise-grade error handling and logging
- Refactor to official Uppy 5 Dashboard component (e39bf987)
    - Remove TailwindCSS dependency in favor of official Uppy styles
    - Simplify component architecture
    - Add comprehensive Dashboard configuration options
- Implement complete Uppy 5 React UI components (937f0408)
    - Include Dropzone, UploadButton, FilesList and related components
    - Redesign Props interface based on Uppy 5
    - Restructure into dedicated `types/` and `utils/` directories
    - Extract Uppy instance creation to `createUppy` utility

### Changed

- Major architecture refactor from prototype to production-ready package (5db2df21)
- Update build configuration, dependencies, and remove obsolete files

---

This changelog was generated from git history and existing tags (`v0.1.0`, `v0.1.1`, `v0.2.0`, `v0.2.1`, `v0.3.0`).