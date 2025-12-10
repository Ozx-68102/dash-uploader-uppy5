import logging
import os
import re
import traceback
from uuid import uuid4

from flask import request, abort, jsonify, Response
from werkzeug.datastructures import FileStorage

logger = logging.getLogger(__name__)


class UploadHandler:
    def __init__(self, folder: str, use_upload_id: bool = True) -> None:
        self.folder = folder
        self.use_upload_id = use_upload_id

    def get_secure_filename(self, filename: str) -> str:
        name = os.path.basename(filename)
        name = re.sub(r'[\\/:*?"<>|]', "_", name).strip().strip('.')

        return f"invalid_filename_{uuid4().hex[:10]}" if not name else name

    def resolve_upload_path(self, upload_id: str) -> str:
        if self.use_upload_id and upload_id:
            return os.path.join(self.folder, upload_id)

        return self.folder

    def save_file(self, file: FileStorage, target: str) -> str:
        filename = self.get_secure_filename(file.filename)
        save_path = os.path.join(target, filename)
        file.save(save_path)
        return filename

    def upload(self) -> Response:
        if 'file' not in request.files:
            return abort(400, 'No file part')

        file = request.files['file']
        if file.filename == '':
            return abort(400, 'No selected file')

        upload_id = self.get_secure_filename(request.form.get('uploadId'))
        target = self.resolve_upload_path(upload_id=upload_id)
        os.makedirs(target, exist_ok=True)

        try:
            saved_filename = self.save_file(file=file, target=target)
        except Exception as e:
            logger.error(traceback.format_exc())
            return abort(500, str(e))

        return jsonify({'status': 'ok', 'filename': saved_filename})
