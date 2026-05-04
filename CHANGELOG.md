# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.1] - 2026-05-04

### Changed

- Refine `upload_id` documentation and examples (cef5bf4)
- Update project dependencies and lock file (a0501dc)

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
