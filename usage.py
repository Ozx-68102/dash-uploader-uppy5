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
du.configure_upload(app, UPLOAD_FOLDER)

app.layout = html.Div([
    html.H1('Dash Uploader Uppy5 Demo'),
    du.DashUploaderUppy5(
        id='uploader',
        uploadUrl='/upload',
        maxFileSize=10 * 1024 * 1024,  # 10MB
        maxNumberOfFiles=5,
    ),
    html.Div(id='upload-status'),
])

# callback function: display upload results
@app.callback(
    Output('upload-status', 'children'),
    [
        Input('uploader', 'successFiles'),
        Input('uploader', 'failedFiles'),
    ],
    prevent_initial_call=True
)
def update_status(successFiles, failedFiles):
    """update upload status display"""
    children = []
    
    if successFiles and len(successFiles) > 0:
        children.append(html.H3('✅ Upload Success:'))
        children.append(html.Ul([
            html.Li(f"{f.get('name', 'unknown')} ({(f.get('size', 0) / 1024):.2f} KB)")
            for f in successFiles
        ]))
    
    if failedFiles and len(failedFiles) > 0:
        children.append(html.H3('❌ Upload Failed:'))
        children.append(html.Ul([
            html.Li(f"{f.get('name', 'unknown')} - {f.get('error', 'Unknown error')}")
            for f in failedFiles
        ]))
    
    return children if children else html.Div('No uploads yet')

if __name__ == '__main__':
    app.run(debug=True)
