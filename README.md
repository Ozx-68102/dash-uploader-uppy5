# dash-uploader-uppy5

![PyPI](https://img.shields.io/pypi/v/dash-uploader-uppy5?style=flat-square&logo=pypi&logoColor=white)
![Python](https://img.shields.io/pypi/pyversions/dash-uploader-uppy5?style=flat-square&logo=python&logoColor=white)
![Downloads](https://img.shields.io/pypi/dm/dash-uploader-uppy5?style=flat-square&color=blueviolet)
![Static Badge](https://img.shields.io/badge/license-MIT-green)

A modern [Dash](https://dash.plotly.com) file uploader component powered by [Uppy 5](https://uppy.io/).

## Features

- **Blazing Fast**: Validated to upload **almost 1.4GB in seconds**. Uses binary streaming (XHR) to bypass legacy chunking overheads.
- **Modern UI**: Built with [Uppy 5](https://uppy.io/) `Dashboard` with a sleek, responsive interface and automatic Dark Mode.
- **Large File Support**: Handles large file uploads efficiently via Flask streaming (`Werkzeug`).
- **Customizable**: Configurable file restrictions (size, type, count) directly from Python.

## Installation
```bash
pip install dash-uploader-uppy5
```

## Usage

See [usage.py](usage.py) or example below.

```python
import dash
from dash import html, Input, Output, no_update

import dash_uploader_uppy5 as du

app = dash.Dash(__name__)

# Configure the upload folder
du.configurator(app, folder='uploads')

app.layout = html.Div([
    html.H1('Dash Application'),
    du.Upload(
        id='uploader',
        max_file_size=1024,  # in Megabyte, 1GB
        allowed_file_types=['.csv'],
        theme='auto',
        upload_id='files'
    ),
    html.Div(id="output-zone")
])


# Handle the callback
@app.callback(
    Output("output-zone", "children"),
    [
        Input("uploader", "uploadedFiles"),
        Input("uploader", "failedFiles")
    ],
    prevent_initial_call=True
)
def handle_upload(uploaded_files, failed_files):
    if uploaded_files:
        last_file = uploaded_files[-1]
        server_name = last_file['response']['filename']
        return f"Uploaded: {server_name}"

    if failed_files:
        return f"Error: {failed_files[0]['error']}"

    return no_update


if __name__ == '__main__':
    app.run()
```

## API Parameters

| Prop                                | Type in Python                      | Default                               | Description                                                                                                                                                                                                                                                                                                           |
|-------------------------------------|-------------------------------------|---------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `id`                                | str                                 | "uppy5-uploader"                      | The id of this component.                                                                                                                                                                                                                                                                                             |
| `upload_url`                        | str                                 | (Auto)                                | The API endpoint (configured by `du.configurator`)                                                                                                                                                                                                                                                                    |
| `allow_multiple_upload_batches`     | bool                                | True                                  | Whether to allow several upload batches. Defaults to True.                                                                                                                                                                                                                                                            |
| `allowed_file_types`                | list[str]                           | None                                  | Wildcards ["image/*"], or exact MIME types ["image/jpeg"], or file extensions [".jpg"].                                                                                                                                                                                                                               |
| `auto_proceed`                      | bool                                | False                                 | If True, it will upload as soon as files are added.                                                                                                                                                                                                                                                                   |
| `max_file_size`                     | int                                 | 1024                                  | Maximum file size in **Megabytes** for each individual file.                                                                                                                                                                                                                                                          |
| `min_file_size`                     | int                                 | None                                  | Minimum file size in **Megabytes** for each individual file.                                                                                                                                                                                                                                                          |
| `max_total_file_size`               | int                                 | None                                  | Maximum file size in **Megabytes** for all the files that can be selected for upload.                                                                                                                                                                                                                                 |
| `max_number_of_files`               | int                                 | 1                                     | Total number of files that can be selected.                                                                                                                                                                                                                                                                           |
| `min_number_of_files`               | int                                 | None                                  | Minimum number of files that must be selected before the upload.                                                                                                                                                                                                                                                      |
| `upload_id`                         | str                                 | str(uuid.uuid4())                     | Custom upload session identifier (UUID by default). Affects subfolder creation via `use_upload_id` in `du.configurator()`.                                                                                                                                                                                            |
| `disabled`                          | bool                                | False                                 | Enabling this option makes the Dashboard grayed-out and non-interactive.                                                                                                                                                                                                                                              |
| `theme`                             | Literal["auto", "light", "dark"]    | "auto"                                | Light or dark theme for the Dashboard. When it is set to `auto`, it will respect the user’s system settings and switch automatically.                                                                                                                                                                                 |
| `note`                              | str                                 | None                                  | A string of text to be placed in the Dashboard UI.                                                                                                                                                                                                                                                                    |
| `size`                              | dict[str, int \| str]               | `{"width": "100%", "height": "100%"}` | Size of the Dashboard. Accepts `"width"` and `"height"`. Defaults to filling the parent container instead of Uppy's built-in 650×500px. Use int for pixels, or a CSS length string (`"100%"`, `"75px"`, `"50vw"`, `"10rem"`, etc.). Examples: `{"width": 500, "height": 300}`, `{"width": "100%", "height": "75px"}`. |
| `hide_progress_details`             | bool                                | False                                 | Show or hide progress details in the status bar.                                                                                                                                                                                                                                                                      |
| `disable_thumbnail_generator`       | bool                                | True                                  | Disable the thumbnail generator completely.                                                                                                                                                                                                                                                                           |
| `disable_done_button`               | bool                                | False                                 | Disable the Dashboard Done button.                                                                                                                                                                                                                                                                                    |
| `disable_status_bar`                | bool                                | False                                 | Disable the status bar completely.                                                                                                                                                                                                                                                                                    |
| `wait_for_thumbnails_before_upload` | bool                                | False                                 | Show the list of added files with a preview and file information.                                                                                                                                                                                                                                                     |
| `show_selected_files`               | bool                                | True                                  | Show the list of added files with a preview and file information.                                                                                                                                                                                                                                                     |
| `single_file_full_screen`           | bool                                | False                                 | When only one file is selected, its preview and meta information will be centered and enlarged.                                                                                                                                                                                                                       |
| `locale_string`                     | dict[str, str]                      | None                                  | Partial Dashboard locale strings. Only provided keys override Uppy defaults; omitted keys keep built-in text. Keys use camelCase (e.g. `"dropPasteFiles"`, `"browseFiles"`). Example: `{"dropPasteFiles": "Drop your files here"}`.                                                                                   |
| `file_manager_selection_type`       | Literal["files", "folders", "both"] | "files"                               | Configure the type of selections allowed when browsing your file system via the file manager selection window.                                                                                                                                                                                                        |
| `hide_upload_button`                | bool                                | False                                 | Show or hide the upload button. Use this if you are providing a custom upload button somewhere and are using `uploadTrigger` to manually trigger uploads. Only effective when `auto_proceed=False`.                                                                                                                   |
| `hide_retry_button`                 | bool                                | False                                 | Hide the retry button in the status bar and on each individual file. Use this if you are providing a custom retry button somewhere and using `retryTrigger` with the `retryAll()` API.                                                                                                                                |
| `hide_cancel_button`                | bool                                | False                                 | Hide the cancel button in the status bar and on each individual file. Use this if you are providing a custom cancel button somewhere and using `cancelTrigger` with the `cancelAll()` API.                                                                                                                            |
| `hide_drag_over_hint`               | bool                                | False                                 | **EXPERIMENTAL**: Hide the drag-over upward arrow hint animation (the blue dashed box with ↑ icon). Not an official Uppy feature and may break on future Uppy updates. Implemented by dynamically injecting a `<style>` rule via `useEffect`.                                                                         |
| `auto_clear_on_complete`            | bool                                | False                                 | Automatically clear all files from the Dashboard after a successful upload completes.                                                                                                                                                                                                                                 |

### About `locale_string`

`locale_string` lets you override a **subset** of Uppy Dashboard drop/paste and browse labels from Python. Keys you omit
keep Uppy’s built-in English defaults; only the keys you pass are replaced.

This component exposes five string keys (camelCase,
matching [Uppy Dashboard locale](https://uppy.io/docs/dashboard/#locale)):

| Key                | Uppy default                                          |
|--------------------|-------------------------------------------------------|
| `dropPasteFiles`   | `Drop files here or %{browseFiles}`                   |
| `dropPasteFolders` | `Drop files here or %{browseFolders}`                 |
| `dropPasteBoth`    | `Drop files here, %{browseFiles} or %{browseFolders}` |
| `browseFiles`      | `browse files`                                        |
| `browseFolders`    | `browse folders`                                      |

#### Placeholders

Some default strings embed placeholders that Uppy replaces at render time:

- `%{browseFiles}` — replaced with the text of `browseFiles` (typically rendered as a clickable “browse” link).
- `%{browseFolders}` — replaced with the text of `browseFolders`.

You may use these placeholders in your custom strings, or omit them entirely and supply plain text instead:

```python
# With placeholders (Uppy default style)
du.Upload(
    locale_string={
        "dropPasteFiles": "Drop files here or %{browseFiles}",
        "browseFiles": "browse files",
    }
)

# Without placeholders (plain text is fine)
du.Upload(
    locale_string={
        "dropPasteFiles": "Drop your files here",
    }
)
```

If you use placeholders, override the corresponding `browseFiles` / `browseFolders` key when you want to control that
link text; otherwise Uppy keeps its default labels for those keys.

#### Which keys are shown?

The visible drop/paste tagline depends on `file_manager_selection_type`:

| `file_manager_selection_type` | Keys used in the UI                             |
|-------------------------------|-------------------------------------------------|
| `"files"` (default)           | `dropPasteFiles`, `browseFiles`                 |
| `"folders"`                   | `dropPasteFolders`, `browseFolders`             |
| `"both"`                      | `dropPasteBoth`, `browseFiles`, `browseFolders` |

You only need to override the keys that match your selection mode. Supplying extra keys (e.g. all five) is harmless —
unused keys simply are not displayed and have no adverse effect.

## Callback Variables

These properties are read-only and updated by the components upon upload events. Use them in `Input` to trigger Dash callbacks.


### `isUploading`

Indicates whether an upload is currently in progress. It reverts to False upon completion, regardless of success or failure.

**Type:** `bool`

### `uploadedFiles`

A list of dictionaries representing successfully uploaded files in the current batch.

**Type:** `list[dict[str, str | int | dict[str, str | int]]]`

**Structure:**
```json
[
  {
    "name": "example.csv",
    "size": 1048576,
    "type": "text/csv",
    "upload_id": "files",
    "response": {
      "status": 200,
      "filename": "example.csv"
    }
  }
]
```

- **name:** Original filename on user's disk.
- **size:** File size in bytes.
- **type:** MIME type.
- **upload_id:** Custom upload session identifier (UUID by default).
- **response.filename:** Sanitized filename saved on the server.

### `failedFiles`

A list of dictionaries representing files that failed to upload.

**Type:** `list[dict[str, str]]`

**Structure:**

```json
[
  {
    "name": "example.exe",
    "error": "File type not allowed"
  }
]
```

- **name:** Original filename on user's disk.
- **error:** Error message from Uppy or Server.

### `clearTrigger`

Write to this property from a Dash callback to clear all files in the uploader. Increment or change the value on each
clear request (for example, use a button's `n_clicks`).

**Type:** `int`

**Usage:**

```python
@app.callback(
    Output("uploader", "clearTrigger"),
    Input("clear-btn", "n_clicks"),
)
def clear_uploader(n_clicks):
    return n_clicks
```

### `clearStatus`

Status returned after `clearTrigger` is processed. This is a receipt for the trigger action itself, not the outcome of
the underlying clear operation. Use as `Input` to react to whether the trigger was accepted.

**Type:** `dict[str, str | int | None]`

**Structure:**

```json
{
  "status": "success",
  "errorMessage": null,
  "attempt": 1
}
```

- **status:** `"success"` or `"error"`.
- **errorMessage:** Error details when `status` is `"error"`, otherwise `null`.
- **attempt:** The trigger value that caused this status (ensures each trigger produces a distinct object, forcing Dash
  to update even if `status` is unchanged).

### `uploadTrigger`

Write to this property from a Dash callback to manually start an upload. Only works when `auto_proceed=False`. Increment
or change the value on each trigger request.

**Type:** `int`

**Usage:**

```python
@app.callback(
    Output("uploader", "uploadTrigger"),
    Input("upload-btn", "n_clicks"),
)
def trigger_manual_upload(n_clicks):
    return n_clicks
```

### `uploadStatus`

Status returned after `uploadTrigger` is processed. This is a receipt for the trigger action itself, not the outcome of
the underlying upload. Use as `Input` to react to whether the trigger was accepted.

**Type:** `dict[str, str | int | None]`

**Structure:** Same as `clearStatus`.

### `cancelTrigger`

Write to this property from a Dash callback to cancel all uploads. Corresponds to `hideCancelButton`. Increment or
change the value on each cancel request.

**Type:** `int`

**Usage:** Same as `uploadTrigger`.

### `cancelStatus`

Status returned after `cancelTrigger` is processed. This is a receipt for the trigger action itself.

**Type:** `dict[str, str | int | None]`

### `retryTrigger`

Write to this property from a Dash callback to retry all failed uploads. Corresponds to `hideRetryButton`. Only retries
failed files (`retryAll()`).

**Type:** `int`

**Usage:** Same as `uploadTrigger`.

### `retryStatus`

Status returned after `retryTrigger` is processed. This is a receipt for the trigger action itself.

**Type:** `dict[str, str | int | None]`

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full changelog.

## Credits & Inspiration

This project is a spiritual successor to the excellent [dash-uploader](https://github.com/fohrloop/dash-uploader) (now archived).
We adopted some parts of its proven Python wrapper patterns and configuration logic but replaced the underlying 
`flow.js` / `Resumable.js` with the more modern and active [Uppy 5](https://uppy.io/).  
  
Special thanks to the original authors for all their groundwork on Dash integration.

## License
MIT License © 2025 Ozx-68102