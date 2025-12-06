from pathlib import Path
from flask import request, jsonify
from dash import Dash



def configure_upload(app: Dash, upload_folder: str, upload_url: str = "/upload"):
    """
    Configure the upload API for dash app.
    This function sets up the file upload endpoint that the Uppy5 component uses.

    Parameters
    ----------
    app: dash.Dash
        The Dash application instance
    upload_folder: str
        The folder where to upload files.
        Can be relative ("uploads") or absolute (r"C:\\tmp\\my_uploads").
        If the folder does not exist, it will be created automatically.
    upload_url: str
        The upload API endpoint URL. Default is "/upload".
    """
    upload_path = Path(upload_folder)
    upload_path.mkdir(parents=True, exist_ok=True)

    @app.server.route(upload_url, methods=['POST'])
    def upload_file():
        """Handle file upload and save to local directory"""
        try:
            if 'file' not in request.files:
                return jsonify({'error': 'No file provided'}), 400
            
            file = request.files['file']
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            # save file to local directory
            filepath = upload_path / file.filename
            file.save(str(filepath))
            
            return jsonify({
                'success': True,
                'filename': file.filename,
                'size': filepath.stat().st_size
            }), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

