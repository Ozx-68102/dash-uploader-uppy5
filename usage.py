import dash_uploader_uppy5 as du
import dash
from dash import html, Input, Output

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
    Output("output-zone", "children"),
    [
        Input("uploader", "uploadedFiles"),
        Input("uploader", "failedFiles")
    ],
    prevent_initial_call=True
)
def test(
        uploaded_files: list[dict[str, str | int | dict[str, str | int]]],
        failed_files: list[dict[str, str]]
):
    print("Callback Triggered !")
    print(uploaded_files)
    print(failed_files)

    return "Successful Triggered callback!"

if __name__ == '__main__':
    app.run(debug=True)
