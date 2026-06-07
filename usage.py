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
            hide_upload_button=True,
            hide_retry_button=True,
            hide_cancel_button=True,
            max_number_of_files=10,
            note="hello!",
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
    Input("uploader", "clearOperation"),
    prevent_initial_call=True,
)
def on_clear_operation_complete(clear_operation: dict | None):
    print(f"Clear result: {clear_operation}")
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
    Input("uploader", "uploadOperation"),
    prevent_initial_call=True,
)
def on_manual_upload_operation(upload_operation: dict | None):
    print(f"Upload trigger result: {upload_operation}")
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
    Input("uploader", "retryOperation"),
    prevent_initial_call=True,
)
def on_retry_operation_complete(retry_operation: dict | None):
    print(f"Retry result: {retry_operation}")
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
    Input("uploader", "cancelOperation"),
    prevent_initial_call=True,
)
def on_cancel_operation_complete(cancel_operation: dict | None):
    print(f"Cancel result: {cancel_operation}")
    return no_update


if __name__ == '__main__':
    app.run(debug=True)
