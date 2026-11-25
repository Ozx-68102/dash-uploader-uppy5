# AGENTS.md

## Commands

Run from the repo root. Python goes through `uv`, Node through `pnpm`. `python` and `twine` are not on PATH. The `justfile` only wraps the commands below, so if `just` is not installed, run them directly.

- Install: `uv sync` and `pnpm install` (`just install`)
- Full build: `pnpm run build` runs webpack, then `dash-generate-components`, then `devscripts/post_build.py` (`just build`)
- Check everything (`just check`):
  - `pnpm run format:check` (oxfmt)
  - `pnpm run lint` (oxlint)
  - `pnpm run typecheck` (`tsc --noEmit`)
  - `uv run ruff format --check`
  - `uv run ruff check`
- Format: `pnpm run format` and `uv run ruff format` (`just format`)
- Demo app: `uv run python usage.py` (needs a built package)

Run the check commands before calling a task done.

## Generated files

`dash_uploader_uppy5/build/` is generated and git-ignored. Never edit it. Until `just build` has run, `import dash_uploader_uppy5` fails because `DashUploaderUppy5.py` and `_imports_.py` do not exist yet, and ruff does not see those files.

`dash-generate-components` builds the Python component, `metadata.json` and the prop docs from the JSDoc comments in `src/components/types/Uploader.ts`. After you edit that file, rebuild and check that `build/metadata.json` changed the way you meant.

## Adding or changing an `Upload()` option

One option lives in several places. Miss one and it fails quietly, so change all of them:

1. `dash_uploader_uppy5/models.py`: the `UploadConfig` field. Its `default` is the single source of truth for the default value.
2. `dash_uploader_uppy5/upload.py`: add the name to `_UPLOAD_API_FIELDS`, to the `Upload()` parameter list, to the `overrides` dict, and to the docstring.
3. `src/components/types/Uploader.ts`: the prop type with a JSDoc comment.
4. `src/components/DashUploaderUppy5.tsx`: pass it to `<Dashboard>` or use it in an effect.
5. `README.md`: the API Parameters table.
6. `CHANGELOG.md`: an entry under `## [Unreleased]`.

Python uses snake_case and the TS prop is the camelCase `alias` from the model.

- `Upload()` parameters default to `_UNSET`, not `None`, because `None` is a real value (for example `max_file_size=None` means no limit). Do not replace `_UNSET`. At runtime `Upload.__signature__` is rebuilt from `UploadConfig`, so the hand-written signature only helps editors.
- Size options are megabytes in the public API and bytes in the model. `convert_mb_to_bytes` in `models.py` and `_get_public_default` in `upload.py` convert in opposite directions. Change both together.

## Trigger props

`clearTrigger`, `uploadTrigger`, `retryTrigger` and `cancelTrigger` pair with `clearStatus`, `uploadStatus`, `retryStatus` and `cancelStatus`. A status says whether the trigger was accepted and the Uppy call was made. It does not say whether the upload succeeded: results arrive in `uploadedFiles` and `failedFiles`. The `attempt` field makes each trigger produce a new status object so Dash callbacks fire again. Keep this meaning when you change a hook or its docs (see commit `9d16437`).

## Style

Formatting is decided by the tools, so do not hand-format. oxfmt keeps double quotes, semicolons and no spaces inside braces (`{useRef}`), width 100. ruff uses line length 100.

## Ask first

Stop and ask before you:

- rename or change the meaning of a public option, callback prop or trigger prop
- change the version in `package.json` or `pyproject.toml`, or publish
- upgrade Uppy, Dash, React or Pydantic, or change the minimum Python version
- turn on oxlint type-aware linting. This project is on TypeScript 5.9.3, and oxlint's type-aware backend reports `baseUrl` in `tsconfig.json` as an invalid tsconfig. With `baseUrl` removed, `--type-check` then fails on the CSS imports in `DashUploaderUppy5.tsx`, which `tsc` accepts.
- edit `.git-blame-ignore-revs`

## Git

- Commit messages: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `style:`, `refactor:`), lowercase, no trailing period, in English.
- Keep formatting-only changes in their own `style:` commit. Add its full hash to `.git-blame-ignore-revs`.
- Work that changes an option, a callback or a dependency goes on a branch, not straight to `main`.
- In `CHANGELOG.md`, end each entry with the first 8 characters of the commit hash in parentheses, for example `(9d16437a)`. Add the entry under `## [Unreleased]` and use Keep a Changelog headings (Added, Changed, Fixed, Documentation).

## Working without prompting

When a task needs facts from the code, the web or the machine, read, search or run the command yourself in the same turn. Do not report that you have not checked something and wait for the user to ask. Report only what you could not check after trying, with the error you got.

## Writing

Before you write any text for a person to read, find the humanizer skill in `~/.agents/skills/humanizer/` and load it. Replies, commit messages, docs and comments all go through it. If you cannot find it, say so and do not write or edit any file.

End every reply with the result or the next fact. Do not close with a question or an offer such as "do you want...", "if you want...", or "shall I...". If a decision is needed to continue, state it once in the body as a plain statement of what is blocked.
