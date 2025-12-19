import dash_uploader_uppy5 as du
import dash
from dash import html, Input, Output, no_update

# Create Dash app
# Dash will automatically discover and load component libraries from installed packages
# IMPORTANT: Make sure to install the component library first using uv:
#   1. Activate virtual environment: .venv\Scripts\activate (Windows) or source .venv/bin/activate (Linux/Mac)
#   2. Install dependencies: uv sync
#   3. Install component library in editable mode: uv pip install -e .
#   4. Restart the application after installation
app = dash.Dash(__name__)

# Configure upload - this sets up the file upload endpoint in the component library
UPLOAD_FOLDER = 'uploads'
du.configurator(app, UPLOAD_FOLDER, use_upload_id=False)

app.layout = html.Div([
    html.H1('Dash Uploader Uppy5 Demo'),
    du.Upload(
        id='uploader',
        upload_id='upload',
        max_number_of_files=10
    ),
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

if __name__ == '__main__':
    app.run(debug=True)
