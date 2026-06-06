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
    du.Upload(
        id='uploader',
        upload_id=None,
        disable_done_button=True,
        max_number_of_files=10,
        size={"width": "10%", "height": "10%"},
        note="hello!",
        locale_string={"dropPasteFiles": "Drop your files here"},
    ),
    html.Button("Clear", id="clear-btn"),
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
def test1(
        uploaded_files: list[dict[str, str | int | dict[str, str | int]]],
        failed_files: list[dict[str, str]]
):
    print(f"Callback 1 Triggered ! Success: {uploaded_files}, Failed: {failed_files}")
    return no_update

@app.callback(
    Output("output-zone", "children", allow_duplicate=True),
    Input("uploader", "isUploading"),
    prevent_initial_call=True
)
def test2(is_uploading: bool):
    print(f"Callback 2 Triggered ! isUploading: {is_uploading}")
    return no_update


@app.callback(
    Output("uploader", "clearTrigger"),
    Input("clear-btn", "n_clicks"),
    prevent_initial_call=True
)
def test3(n_clicks: int):
    print(f"Callback 3 Triggered ! n_clicks: {n_clicks}")
    return n_clicks


@app.callback(
    Output("output-zone", "children", allow_duplicate=True),
    Input("uploader", "clearOperation"),
    prevent_initial_call=True,
)
def test4(clear_operation: dict | None):
    print(f"Clear result: {clear_operation}")
    return no_update

if __name__ == '__main__':
    app.run(debug=True)
