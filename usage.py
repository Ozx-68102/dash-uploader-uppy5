from typing import Final

import dash
from dash import html, Input, Output, no_update

import dash_uploader_uppy5 as du

# Create Dash app
# Dash will automatically discover and load component libraries from installed packages
# IMPORTANT: Make sure to install the component library first using uv:
#   1. Activate virtual environment: .venv\Scripts\activate (Windows) or source .venv/bin/activate (Linux/Mac)
#   2. Install dependencies: uv sync
#   3. Install component library in editable mode: uv pip install -e .
#   4. Restart the application after installation
app = dash.Dash(__name__)

# Configure upload - this sets up the file upload endpoint in the component library
UPLOAD_FOLDER: Final[str] = 'uploads'
du.configurator(app, UPLOAD_FOLDER)

app.layout = html.Div([
    html.H1('Dash Uploader Uppy5 Demo'),
    html.Div([
        du.Upload(
            id='uploader',
            upload_id=None,
            disable_done_button=False,
            auto_proceed=True,
            auto_clear_on_complete=True,
            hide_retry_button=True,
            hide_cancel_button=True,
            disable_status_bar=True,
            max_number_of_files=10,
            hide_drag_over_hint=True,
            locale_string={"dropPasteFiles": "Drop your files here"},
        ),
        html.Button("Clear", id="clear-btn"),
        html.Button("Manual Upload", id="upload-btn"),
        html.Button("Retry", id="retry-btn"),
        html.Button("Cancel", id="cancel-btn"),
    ], style={"width": 300, "height": 200}),

    html.Div(id="output-zone")
])

@app.callback(
    Output("output-zone", "children", allow_duplicate=True),
    [
        Input("uploader", "uploadedFiles"),
        Input("uploader", "failedFiles")
    ],
    prevent_initial_call=True
)
def on_file_upload_complete(
        uploaded_files: list[dict[str, str | int | dict[str, str | int]]],
        failed_files: list[dict[str, str]]
):
    print(f"File upload complete triggered ! Success: {uploaded_files}, Failed: {failed_files}")
    return no_update

@app.callback(
    Output("output-zone", "children", allow_duplicate=True),
    Input("uploader", "isUploading"),
    prevent_initial_call=True
)
def on_uploading_state_change(is_uploading: bool):
    print(f"Uploading state change triggered ! isUploading: {is_uploading}")
    return no_update


@app.callback(
    Output("uploader", "clearTrigger"),
    Input("clear-btn", "n_clicks"),
    prevent_initial_call=True
)
def trigger_clear_upload(n_clicks: int):
    print(f"Clear upload triggered ! n_clicks: {n_clicks}")
    return n_clicks


@app.callback(
    Output("output-zone", "children", allow_duplicate=True),
    Input("uploader", "clearStatus"),
    prevent_initial_call=True,
)
def on_clear_status(clear_status: dict | None):
    print(f"Clear status: {clear_status}")
    return no_update


@app.callback(
    Output("uploader", "uploadTrigger"),
    Input("upload-btn", "n_clicks"),
    prevent_initial_call=True,
)
def trigger_manual_upload(n_clicks: int):
    print(f"Manual upload triggered ! Manual upload requested: {n_clicks}")
    return n_clicks


@app.callback(
    Output("output-zone", "children", allow_duplicate=True),
    Input("uploader", "uploadStatus"),
    prevent_initial_call=True,
)
def on_upload_status(upload_status: dict | None):
    print(f"Upload status: {upload_status}")
    return no_update


@app.callback(
    Output("uploader", "retryTrigger"),
    Input("retry-btn", "n_clicks"),
    prevent_initial_call=True,
)
def trigger_retry_failed(n_clicks: int):
    print(f"Retry failed triggered ! Retry requested: {n_clicks}")
    return n_clicks


@app.callback(
    Output("output-zone", "children", allow_duplicate=True),
    Input("uploader", "retryStatus"),
    prevent_initial_call=True,
)
def on_retry_status(retry_status: dict | None):
    print(f"Retry status: {retry_status}")
    return no_update


@app.callback(
    Output("uploader", "cancelTrigger"),
    Input("cancel-btn", "n_clicks"),
    prevent_initial_call=True,
)
def trigger_cancel_upload(n_clicks: int):
    print(f"Cancel upload triggered ! Cancel requested: {n_clicks}")
    return n_clicks


@app.callback(
    Output("output-zone", "children", allow_duplicate=True),
    Input("uploader", "cancelStatus"),
    prevent_initial_call=True,
)
def on_cancel_status(cancel_status: dict | None):
    print(f"Cancel status: {cancel_status}")
    return no_update


if __name__ == '__main__':
    app.run(debug=True)
