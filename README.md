# dash-uploader-uppy5
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

```python
import dash_uploader_uppy5 as du
import dash
from dash import html, Input, Output, no_update

app = dash.Dash(__name__)

# Configure the upload folder
du.configurator(app, folder='uploads')

app.layout = html.Div([
    html.H1('Dash Application'),
    du.Upload(
        id='uploader',
        max_file_size=1024, # in Megabyte, 1GB
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
| Prop                                | Type in Python                      | Default           | Description                                                                                                                           |
|-------------------------------------|-------------------------------------|-------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| `id`                                | str                                 | "uppy5-uploader"  | The id of this component.                                                                                                             |
| `upload_url`                        | str                                 | (Auto)            | The API endpoint (configured by `du.configurator`)                                                                                    |
| `allow_multiple_upload_batches`     | bool                                | True              | Whether to allow several upload batches. Defaults to True.                                                                            |
| `allowed_file_types`                | list[str]                           | None              | Wildcards ["image/*"], or exact mime types ["image/jpeg"], or file extensions [".jpg"].                                               |
| `auto_proceed`                      | bool                                | False             | If True, it will upload as soon as files are added.                                                                                   |
| `max_file_size`                     | int                                 | 1024              | Maximum file size in **Megabytes** for each individual file.                                                                          |
| `min_file_size`                     | int                                 | None              | Minimum file size in **Megabytes** for each individual file.                                                                          |
| `max_total_file_size`               | int                                 | None              | Maximum file size in **Megabytes** for all the files that can be selected for upload.                                                 |
| `max_number_of_files`               | int                                 | 1                 | Total number of files that can be selected.                                                                                           |
| `min_number_of_files`               | int                                 | None              | Minimum number of files that must be selected before the upload.                                                                      |
| `upload_id`                         | str                                 | str(uuid.uuid4()) | The unique identifier for the upload session.                                                                                         |
| `disabled`                          | bool                                | False             | Enabling this option makes the Dashboard grayed-out and non-interactive.                                                              |
| `theme`                             | Literal["auto", "light", "dark"]    | "auto"            | Light or dark theme for the Dashboard. When it is set to `auto`, it will respect the user’s system settings and switch automatically. |
| `note`                              | str                                 | None              | A string of text to be placed in the Dashboard UI.                                                                                    |
| `size`                              | dict[str, int]                      | None              | Size of the Dashboard in pixels. It only accepts "width" and "height". Example: `{"width": 500, "height": 300}`.                      |
| `hide_progress_details`             | bool                                | False             | Show or hide progress details in the status bar.                                                                                      |
| `disable_thumbnail_generator`       | bool                                | True              | Disable the thumbnail generator completely.                                                                                           |
| `wait_for_thumbnails_before_upload` | bool                                | False             | Show the list of added files with a preview and file information.                                                                     |
| `single_file_full_screen`           | bool                                | False             | When only one file is selected, its preview and meta information will be centered and enlarged.                                       |
| `file_manager_selection_type`       | Literal["files", "folders", "both"] | "files"           | Configure the type of selections allowed when browsing your file system via the file manager selection window.                        |

## Callback Variables

These properties are read-only and updated by the components upon upload events. Use them in `Input` to trigger Dash callbacks.

### UploadedFiles

A list of dictionaries representing successfully uploaded files in the current batch.

**Structure:**
```json
[
  {
    "name": "example.csv",
    "size": 1048576,
    "type": "text/csv",
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
- **response.filename:** Sanitized filename saved on the server.

### failedFiles

A list of dictionaries representing files that failed to upload.

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

## Credits & Inspiration

This project is a spiritual successor to the excellent [dash-uploader](https://github.com/fohrloop/dash-uploader) (now archived).
We adopted some parts of its proven Python wrapper patterns and configuration logic but replaced the underlying 
`flow.js` / `Resumable.js` with the more modern and active [Uppy 5](https://uppy.io/).  
  
Special thanks to the original authors for all their groundwork on Dash integration.

## License
MIT License © 2025 Ozx-68102